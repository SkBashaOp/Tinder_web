import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api" || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Rely on React Router (Body.jsx) to handle 401 redirects.
    // window.location.href forces hard reloads and breaks parallel auth flows.
    return Promise.reject(error);
  }
);

export default axiosInstance;


