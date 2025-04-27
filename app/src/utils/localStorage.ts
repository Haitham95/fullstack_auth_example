// src/utils/localStorage.ts
import { User } from "../types/auth.types";

interface StoredAuth {
  user: User;
  accessToken: string;
}

const AUTH_KEY = "access_token";

// Get auth data from localStorage
export const getStoredAuth = (): StoredAuth | null => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error("Error getting auth data from localStorage:", error);
    return null;
  }
};

// Save auth data to localStorage
export const setStoredAuth = (data: StoredAuth): void => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving auth data to localStorage:", error);
  }
};

// Remove auth data from localStorage
export const removeStoredAuth = (): void => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error("Error removing auth data from localStorage:", error);
  }
};
