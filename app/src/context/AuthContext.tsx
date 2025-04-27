// src/context/AuthContext.tsx
import React, { createContext, useReducer, useEffect } from "react";
import {
  AuthState,
  AuthContextType,
  SignInData,
  SignUpData,
} from "../types/auth.types";
import {
  getStoredAuth,
  setStoredAuth,
  removeStoredAuth,
} from "../utils/localStorage";
import api from "../services/api";

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "SIGNUP_SUCCESS" }
  | {
      type: "AUTH_SUCCESS";
      payload: { user: AuthState["user"]; accessToken: string };
    }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        error: null,
        isLoading: false,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = getStoredAuth();

      if (storedAuth && storedAuth.accessToken) {
        try {
          // Set token in axios headers
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedAuth.accessToken}`;

          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              user: storedAuth.user,
              accessToken: storedAuth.accessToken,
            },
          });
        } catch (error) {
          // Token is invalid
          removeStoredAuth();
          dispatch({ type: "AUTH_LOGOUT" });
        }
      } else {
        dispatch({ type: "AUTH_LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (data: SignInData) => {
    dispatch({ type: "AUTH_START" });

    try {
      // In a real app, this would call your backend API
      const response = await api.post("/auth/login", data);

      const { _id, name, email, accessToken } = response.data;

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Store in localStorage
      setStoredAuth({ user: { id: _id, name, email }, accessToken });

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: { id: _id, name, email }, accessToken },
      });
    } catch (error: any) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: error.response?.data?.message || "Failed to sign in",
      });
    }
  };

  // Sign up function
  const signUp = async (data: SignUpData) => {
    dispatch({ type: "AUTH_START" });

    try {
      await api.post("/users/create", data);

      dispatch({ type: "SIGNUP_SUCCESS" });
      return { success: true };
    } catch (error: any) {
      dispatch({
        type: "AUTH_FAILURE",
        payload: error.response?.data?.message || "Failed to sign up",
      });
      return { success: false };
    }
  };

  // Sign out function
  const signOut = async () => {
    // Clear token from headers
    delete api.defaults.headers.common["Authorization"];

    await api.post("/auth/logout");

    // Clear localStorage
    removeStoredAuth();

    // Update state
    dispatch({ type: "AUTH_LOGOUT" });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
