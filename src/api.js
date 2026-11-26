import axios from "axios";

const api = axios.create({
  baseURL: "https://rizztixxpaynthra.onrender.com/api",
  withCredentials: true,
});

export default api;
