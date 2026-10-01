import api from "./api";

export const registerUser = async (payload) => (await api.post("/auth/register", payload)).data.data;
export const loginUser = async (payload) => (await api.post("/auth/login", payload)).data.data;
export const getCurrentUser = async () => (await api.get("/auth/me")).data.data.user;
