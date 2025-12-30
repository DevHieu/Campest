import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  if (
    config.url.startsWith("/user") ||
    config.url.startsWith("/admin") ||
    config.url.startsWith("/auth/get-user")
  ) {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) {
      console.log("Attaching token to request:", token);
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosClient;
