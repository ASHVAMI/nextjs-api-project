# NestJS API with PostgreSQL and JWT Authentication

## Description

This project is a RESTful API built with NestJS and PostgreSQL. It provides endpoints for CRUD operations on users and includes authentication and authorization using JSON Web Tokens (JWT). The project uses TypeORM for database interaction and is designed to handle user registration, login, and CRUD operations securely.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete users.
- **Authentication**: Register and login users with JWT-based authentication.
- **Authorization**: Secure endpoints using JWTs.
- **Validation**: Input validation for user data.
- **Error Handling**: Comprehensive error handling throughout the API.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5).
- **JWT**: JSON Web Tokens for authentication.
- **Supertest**: For end-to-end testing of HTTP requests.

## Installation

1. Navigate to the project directory:
   cd nestjs-api-project

2. Install dependencies:
npm install

3. Set up environment variables. Create a .env file in the root directory and add the following variables:
 
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=yourusername
DB_PASSWORD=yourpassword
DB_DATABASE=yourdatabase
JWT_SECRET=yourjwtsecret

4. Run the application:
npm run start


Running Tests
To run the end-to-end tests:
npm run test:e2e


Thank you Ashvani ...... 
