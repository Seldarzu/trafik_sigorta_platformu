// src/frontend/api/axios.ts
import axios from 'axios';

// API instance oluştur
const api = axios.create({
  baseURL: '/api', // Backend API base path
  withCredentials: false, // Çerez gönderimi gerekmiyorsa false
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor (her isteğe ekleme yapabiliriz)
api.interceptors.request.use(
  (config) => {
    // Örnek: Eğer JWT token kullanılacaksa localStorage'dan ekleyebilirsin
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (hata yönetimi)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Örnek: Yetkisiz istek olursa login sayfasına yönlendirme
    if (error.response?.status === 401) {
      console.warn('Oturum süresi doldu veya yetkisiz erişim.');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
