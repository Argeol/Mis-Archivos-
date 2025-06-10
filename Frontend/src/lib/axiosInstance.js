// axiosInstance.ts
import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true,
  headers: {
    Accept: '*/*',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Si es error 403 por falta de rol o permiso explícito
    if (error.response?.status === 403) {
      toast("No tienes permisos", {
          description: "No tienes permisos para acceder a este recurso",
        });
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirige a la página que prefieras
      }, 3000);
      return Promise.reject(error);
    }

    // Si el token expiró (401), intentamos refrescar
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('api/User/RefreshToken'); // Llama al backend a renovar token
        return axiosInstance(originalRequest); // Reintenta la solicitud original
      } catch (refreshError) {
        // Si el refresh falla, redirige al login
        toast("Sesión expirada", {
          description: "Debes iniciar sesión nuevamente",
        });

        setTimeout(() => {
          window.location.href = "/user/login";
        }, 3000);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
