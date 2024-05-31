import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 50000,
  headers: { Accept: "application/json, text/plain" },
});

export default axiosInstance;
