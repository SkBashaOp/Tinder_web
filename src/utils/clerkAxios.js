import axios from "axios";

/**
 * clerkAxios — an axios instance that automatically attaches the Clerk JWT
 * as an Authorization header on every request.
 *
 * Usage:
 *   import clerkAxios, { setClerkTokenGetter } from "./clerkAxios";
 *   setClerkTokenGetter(getToken);         // call once in ClerkCallback
 *   const res = await clerkAxios.get("/clerk/profile");
 */

let _getToken = null;

/**
 * Call this once after Clerk auth is ready, passing in the getToken function
 * from Clerk's useAuth() hook.
 */
export const setClerkTokenGetter = (fn) => {
  _getToken = fn;
};

const clerkAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — inject Bearer token before every request
clerkAxios.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("clerkAxios: could not get Clerk token", err);
    }
  }
  return config;
});

// Response interceptor — handle 401 globally
clerkAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Rely on React Router to handle 401 redirects.
    return Promise.reject(error);
  }
);

export default clerkAxios;
