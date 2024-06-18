import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL || "",
  timeout: 50000,
  headers: { Accept: "application/json, text/plain" },
});

export default axiosInstance;
