import axios from "axios";

// export const BASE_URL = "http://localhost:3001/api";
// export const STATIC_URL = "http://localhost:3001";

export const BASE_URL = "https://talenttrove-ivhm.onrender.com/api";
export const STATIC_URL = "https://talenttrove-ivhm.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
