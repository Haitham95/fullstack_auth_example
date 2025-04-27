# Frontend Documentation

This documentation covers the React frontend implementation of the authentication system.

## Technology Stack

- **Framework**: React
- **Language**: TypeScript
- **Routing**: React Router
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Form Validation**: Zod
- **Styling**: Tailwind CSS

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/          # API services and axios configuration
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts for state management
│   ├── pages/        # Application pages
│   ├── routes/       # Route definitions and protection
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main application component
│   └── main.tsx     # Application entry point
```

## Features

### Authentication

- User registration
- User login
- Authentication persistence across page refreshes
- Automatic refresh JWT access token to keep user logged in

## Pages

### Authentication Pages

- **SignUp**: User registration form
- **SignIn**: User login form

### Main Pages

- **Dashboard**: User dashboard (protected route)

## Authentication Flow

### Registration

1. User fills out registration form
2. Form is validated on client-side
3. Form is submitted to API
4. Redirected to SignIn page after 2 seconds

### Login

1. User enters email and password
2. Credentials are validated on client-side
3. Credentials are submitted to API
4. On successful authentication:
   - JWT token is stored in local storage
   - User data is stored in auth context
   - User is redirected to dashboard

## State Management

Authentication state is managed using React Context API:

```typescript
// AuthContext provides:
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<{ success: boolean }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}
```

## Protected Routes

Routes that require authentication are wrapped with the `PrivateRoute` component:

```typescript
const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Render the protected component
  return <Outlet />;
};
```

## API Integration

The frontend communicates with the backend using Axios:

```typescript
// API client configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authentication token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Form Validation

Forms are validated using Zod schemas:

```typescript
// Password validation regex
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Sign up schema
const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .trim(),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(PASSWORD_REGEX, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Sign in schema
const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
  password: z.string().min(1, { message: "Password is required" }),
});
```

## Error Handling

API errors are caught and displayed to the user using the Alert component:

```typescript
try {
  await login(email, password);
  navigate("/dashboard");
} catch (error) {
  setError(error.response?.data?.message || "An error occurred");
}
```

## Development

### Running the Development Server

```bash
npm start run
```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Styling

The application uses Tailwind CSS for styling. Custom styles can be added in the `src/styles` directory.

## Best Practices

- Use TypeScript for type safety
- Separate logic from presentation
- Keep components small and focused
- Handle errors gracefully
- Validate forms on both client and server
