import axios from 'axios';

export default axios.create({
  baseURL: '/api',  // vite.config.ts’daki proxy
  headers: { 'Content-Type': 'application/json' }
});
