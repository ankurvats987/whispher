import axios from "axios";

const authAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
    ? `${import.meta.env.VITE_BASE_URL}/api/v1`
    : "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const login = async (credentials) =>
  await authAPI.post("/user/login", credentials);

export const register = async (data) =>
  await authAPI.post("/user/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const refreshToken = async () => await authAPI.post("/user/refresh");

export const logout = async () => await authAPI.post("/user/logout");

export const reset = async (email) =>
  await authAPI.post("/user/reset", { email });

export const updatePwd = async (data) =>
  await authAPI.post("/user/reset/update", data);

export default authAPI;
