// auth.js
import { jwtDecode } from "jwt-decode";


export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // ← Aquí puedes ver los datos del usuario
    return decoded; // Ejemplo: { email: "usuario@ejemplo.com", role: "admin" }
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
};
