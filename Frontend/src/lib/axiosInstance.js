// axiosInstance.ts
import axios from 'axios';
import { toast } from 'sonner'; // si usas shadcn/ui

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true,
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

// Interceptor de respuesta para manejar el 401 globalmente
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403  || error.response.status === 401){
      // Puedes mostrar un toast si tienes UI
      toast({
        title: "Sesión expirada",
        description: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
        variant: "destructive",
      });

      // Redirige al login después de un breve tiempo
      setTimeout(() => {
        window.location.href = "/user/login";
      }, 3000);
    }

    return Promise.reject(error); // sigue propagando el error
  }
);

export default axiosInstance;
