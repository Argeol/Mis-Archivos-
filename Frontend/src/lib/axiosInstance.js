import axios from 'axios';

 const axiosInstance = axios.create({
     baseURL: 'http://192.168.194.38:5000/',
     Headers:{
         'acept': '*/*',
         'Content-Type': 'application/json',
         // Autorizer 

         'Authorize': 'Bearer: '

     }
 });

export default axiosInstance;