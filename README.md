# Full-Stack Authentication Example (boilerplate for react, nestjs and mongodb)

This repository contains a full-stack authentication implementation using React for the frontend and NestJS for the backend. The project demonstrates user registration, login, protected routes.

## Project Structure

The project is divided into two main parts:

- **backend**: A NestJS application that provides authentication APIs
- **frontend**: A React application that consumes these APIs

## Prerequisites

**this project is tested using a linux machine**

- Node.js (v16 or later)
- npm
- Docker & docker-compose

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and fill in your database credentials and other environment variables:

   ```
   MONGO_DB_USERNAME={username}
   MONGO_DB_PASSWORD={password}
   MONGO_DB_URL={URI}
   SALT_ROUNDS={number}
   JWT_ACCESSTOKEN_SECRET={secret_key_for_accessToken}
   JWT_REFRESHTOKEN_SECRET={secret_key_for_refreshToken}
   ```

4. Start the backend server:

   ```bash
   npm run start:dev
   ```

   The backend server will be available at `http://localhost:3001`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend application:

   ```bash
   npm start dev
   ```

   The frontend will be available at `http://localhost:5173`.

## Features

- User registration
- User login with JWT-based authentication
- JWT-based refresh token and HTTP-only cookies for security purposes
- Protected routes based on authentication state
- Form validation

## Documentation

For more detailed documentation:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
