import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api" || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;


