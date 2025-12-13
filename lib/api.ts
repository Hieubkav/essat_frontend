import axios from 'axios';

const isServer = typeof window === 'undefined';

// Convert localhost -> 127.0.0.1 cho Server Side (Next.js SSR/SSG)
// Vì trên server, localhost có thể không resolve đúng
const coerceLoopbackHostname = (url: string): string => {
  if (!url || !isServer) {
    return url;
  }
  try {
    const parsed = new URL(url);
    if (parsed.hostname.toLowerCase() === 'localhost') {
      parsed.hostname = '127.0.0.1';
      return parsed.toString().replace(/\/$/, ''); // Bỏ trailing slash
    }
  } catch {
    // Giữ nguyên nếu không parse được
  }
  return url;
};

const baseURL = coerceLoopbackHostname(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');

const api = axios.create({
  baseURL,
});

// Add token to every request (chỉ khi ở client side)
api.interceptors.request.use((config) => {
  if (!isServer) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!isServer) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
