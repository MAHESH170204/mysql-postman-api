
# MySQL Postman API

A REST API built using Node.js, Express.js, and MySQL.

## Features
- Create employee records using POST
- Retrieve records using GET
- Update employee records using PUT
- Delete employee records using DELETE
- Store data permanently in MySQL

## Technologies
- Node.js
- Express.js
- MySQL
- Postman

## Setup
1. Install Node.js and MySQL Server.
2. Clone this repository.
3. Install dependencies:

   npm install

4. Create the company_db database and employees table.
5. Copy .env.example to .env.
6. Configure your MySQL credentials in .env.
7. Start the server:

   node server.js

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /employees | Get all employees |
| GET | /employees/:id | Get one employee |
| POST | /employees | Create an employee |
| PUT | /employees/:id | Update an employee |
| DELETE | /employees/:id | Delete an employee |

## Server
http://localhost:3000
