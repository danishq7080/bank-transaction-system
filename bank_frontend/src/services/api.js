import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"
});

// Request interceptor - add token
API.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor - handle 401
API.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default API;