// src/frontend/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',           
  withCredentials: false,
});

export default api;
