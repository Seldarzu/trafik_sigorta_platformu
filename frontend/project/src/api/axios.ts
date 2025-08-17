// src/api/axios.ts
import axios from 'axios';
import { ENV } from '@/config/env';

const api = axios.create({
  baseURL: ENV.API_BASE_URL, // '/api' fallback'ı env.ts sağlıyor
});

export default api;
