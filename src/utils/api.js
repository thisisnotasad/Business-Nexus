import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

console.log('API Base URL:', api.defaults.baseURL);

export default api;