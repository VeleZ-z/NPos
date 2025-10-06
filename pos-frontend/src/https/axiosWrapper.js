import axios from "axios";

const token = localStorage.getItem("token");

const defaultHeader = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
  Accept: "application/json",
};

export const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { ...defaultHeader },
});

// Interceptor para actualizar el token en cada petición
axiosWrapper.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);