
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "company_db",
  waitForConnections: true,
  connectionLimit: 10
});

const allowedFields = ["name", "age", "department", "role"];

// Server status
app.get("/", (req, res) => {
  res.json({ message: "Employee API is running" });
});

// GET: Retrieve all employees
app.get("/employees", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM employees ORDER BY employee_id"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve employees" });
  }
});

// GET: Retrieve one employee by ID
app.get("/employees/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM employees WHERE employee_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve employee" });
  }
});

// POST: Insert a new employee
app.post("/employees", async (req, res) => {
  const { name, age, department, role } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (age != null && (!Number.isInteger(age) || age < 0 || age > 150)) {
    return res.status(400).json({ error: "Age must be a valid integer" });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO employees (name, age, department, role)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), age ?? null, department ?? null, role ?? null]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM employees WHERE employee_id = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

// PUT: Update employee details by ID
app.put("/employees/:id", async (req, res) => {
  const updates = Object.entries(req.body).filter(([key]) =>
    allowedFields.includes(key)
  );

  if (updates.length === 0) {
    return res.status(400).json({
      error: "Provide at least one valid field: name, age, department, role"
    });
  }

  if (updates.some(([key, value]) =>
    (key === "name" && (typeof value !== "string" || !value.trim())) ||
    (key === "age" && value !== null &&
      (!Number.isInteger(value) || value < 0 || value > 150))
  )) {
    return res.status(400).json({ error: "Invalid name or age" });
  }

  try {
    const setClause = updates.map(([key]) => `\`${key}\` = ?`).join(", ");
    const values = updates.map(([key, value]) =>
      key === "name" && typeof value === "string" ? value.trim() : value
    );

    const [result] = await pool.execute(
      `UPDATE employees SET ${setClause} WHERE employee_id = ?`,
      [...values, req.params.id]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM employees WHERE employee_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee: rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// DELETE: Remove an employee by ID
app.delete("/employees/:id", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM employees WHERE employee_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

// Connect to MySQL before starting the API
async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("MySQL connected successfully");

    app.listen(process.env.PORT || 3000, () => {
      console.log("API running at http://localhost:3000");
    });
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
}

startServer();
