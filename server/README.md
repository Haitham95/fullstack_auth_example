# Backend Documentation

This documentation covers the NestJS backend implementation of the authentication system.

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Architecture

The backend follows a modular architecture with the following components:

- **Modules**: Functional units that encapsulate related controllers, services, and providers
- **Controllers**: Handle HTTP requests and delegate business logic to services
- **Services**: Implement business logic and interact with repositories
- **Schemas**: Define database models
- **DTOs**: Define data transfer objects for validation and type safety
- **Guards**: Protect routes based on authentication status

## API Endpoints

### Authentication

#### Register User

- **URL**: `/users/create`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John"
  }
  ```
- **Response**: User object without password

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate user and return JWT token and create a JWT refresh Token, saving it to DB and an HTTP Cookie
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: Access token and user information

#### Refresh Token

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Description**: checks the HTTP-cookie, refresh the access token and create new refresh token
- **Authentication**: Refresh token cookie required
- **Request headers**:
  ```json
  {
    cookie
  }
  ```
- **Response**: Access token

#### Logout

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Description**: remove the HTTP-cookie and delete refresh token from DB
- **Authentication**: JWT token required

### User

#### Get User Profile

- **URL**: `/users/me`
- **Method**: `GET`
- **Description**: Get authenticated user's profile
- **Authentication**: JWT Bearer token required
- **Response**: User object without password

## Database Schema

### User Schema

- `email` (String): User's email (unique)
- `password` (String): Hashed password
- `name` (String): User's first name
- `createdAt` (Date): Record creation timestamp

## Authentication Flow

1. **Registration**:

   - User submits registration form
   - Backend validates input
   - Password is hashed
   - User record is created in database

2. **Logout**:

   - User clicks on logout button
   - Backend deletes the cookie from the request, and refresh token from DB

3. **Login**:

   - User submits login form
   - Backend validates credentials
   - If valid and email is verified, JWT token & JWT refresh token are generated and returning access token and refresh token cookie

4. **Refresh Token**:
   - User protected route while the JWT token expired (accessToken expire after 15 mins)
   - Backend checks the JWT refresh token in both DB and cookie
   - If valid, Backend regenrate a new refresh token and access token and send new access token to the frontend

## Guards and Middleware

- **JwtAuthGuard**: Protects routes that require authentication
- **JwtRefreshAuthGuard**: Protects refresh-token route

## Configuration

The backend uses environment variables for configuration. Create a `.env` file with the following variables:

```
MONGO_DB_USERNAME={username}
MONGO_DB_PASSWORD={password}
MONGO_DB_URL={URI}
SALT_ROUNDS={number}
JWT_ACCESSTOKEN_SECRET={secret_key_for_accessToken}
JWT_REFRESHTOKEN_SECRET={secret_key_for_refreshToken}
```

## Error Handling

The application uses a global exception filter to handle errors consistently. HTTP exceptions are mapped to appropriate status codes and error messages.
