// // // auth.js
// // import { jwtDecode } from "jwt-decode";

// // export const getUserFromToken = () => {
// //   const token = localStorage.getItem('token');
// //   if (!token) return null;

// //   try {
// //     const decoded = jwtDecode(token); // ← Aquí puedes ver los datos del usuario
// //     return decoded; // Ejemplo: { email: "usuario@ejemplo.com", role: "admin" }
// //   } catch (error) {
// //     console.error("Token inválido", error);
// //     return null;
// //   }
// // };

// import axiosInstance from "@/lib/axiosInstance";

// export const getUserFromToken = async () => {
//   try {
//     const response = await axiosInstance.get("/api/User/Me", {
//       withCredentials: true,
//     });
//     if (response.status === 200) {
//       return response.data; // Retorna la información del usuario (como la que se obtiene de tu API)
//     }
//   } catch (error) {
//     console.error("Error al obtener los datos del usuario:", error);
//     return null; // Si algo sale mal, retornamos null
//   }
// };
