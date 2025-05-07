import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5158/',
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O donde lo hayas guardado
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Así debe ser
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
