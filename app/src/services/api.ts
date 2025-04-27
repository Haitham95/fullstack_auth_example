import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getStoredAuth,
  setStoredAuth,
  removeStoredAuth,
} from "../utils/localStorage";

// Token refresh state to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This allows cookies to be sent with requests
});

// Add a request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to each request if available
    const auth = getStoredAuth();

    if (auth && auth.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // If there's no config, we can't retry the request
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check if the error is due to an expired token (status 401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we're already refreshing, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token - the endpoint will use the HttpOnly cookie
        const response = await api.post("/auth/refresh-token");
        const { accessToken } = response.data;

        // Update token in local storage
        const auth = getStoredAuth();
        if (auth && auth.user) {
          setStoredAuth({ user: auth.user, accessToken });
        }

        // Update header for original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process any queued requests with the new token
        processQueue(null, accessToken);

        // Return the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid or expired
        processQueue(refreshError, null);

        // Clear auth data
        removeStoredAuth();

        // Redirect to login
        window.location.href = "/signin";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;
