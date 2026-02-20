import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    if (config.data) {
      console.log("[API Request Body]", config.data);
    }
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error("[API Error]", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default axiosClient;