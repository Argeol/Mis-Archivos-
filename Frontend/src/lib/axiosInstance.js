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
    if (error.response?.status === 403){
      // Puedes mostrar un toast si tienes UI
      toast({
        title: "Error",
        description: "No tiene permisos para acceder a este recurso",
        variant: "destructive",
      });
      // Redirige al login después de un breve tiempo
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    }

    return Promise.reject(error); // sigue propagando el error
  }
);

export default axiosInstance;
