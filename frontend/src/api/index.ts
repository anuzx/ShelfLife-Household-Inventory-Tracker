import axios from "axios";

const BACKEND_URL = "http://localhost:3000";

export const authClient = axios.create({
  baseURL: `${BACKEND_URL}/api/auth`,
});

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
