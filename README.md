
# MySQL Postman API

A RESTful employee management API built with Node.js, Express.js, and MySQL.

## Features
- Create employee records using POST
- Retrieve all employees or a single employee using GET
- Update employee details using PUT
- Delete employee records using DELETE
- Persistent data storage with MySQL
- JSON request and response handling

## Technologies
- Node.js
- Express.js
- MySQL
- Postman
- JavaScript

## Installation

1. Install Node.js and MySQL Server.
2. Clone this repository.
3. Install dependencies:

   npm install

4. Create the `company_db` database and `employees` table.
5. Copy `.env.example` to `.env`.
6. Configure your local MySQL credentials in `.env`.
7. Start the server:

   node server.js

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /employees | Retrieve all employees |
| GET | /employees/:id | Retrieve one employee |
| POST | /employees | Create an employee |
| PUT | /employees/:id | Update employee details |
| DELETE | /employees/:id | Delete an employee |

## Local Server

http://localhost:3000

## Security

Keep database credentials in `.env`. Never publish passwords or secrets to GitHub.
