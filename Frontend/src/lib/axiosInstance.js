import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5158/', // Tu backend
  withCredentials: true, //  Enviar cookies automáticamente
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
