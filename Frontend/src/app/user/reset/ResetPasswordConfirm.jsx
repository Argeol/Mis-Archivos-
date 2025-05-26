"use client";

import { useLocation } from "react-router-dom"; // Usamos useLocation para leer parámetros de la URL
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";

function ResetPasswordConfirm() {
  const location = useLocation(); // Obtén la ubicación de la URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtén el token de los parámetros de la URL
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      setMessage("El token no es válido.");
    }
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/api/User/ResetPasswordConfirm", { token, newPassword: password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error desconocido.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Restablecer Contraseña</h2>
      
      <Input
        label="Nueva Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: '100%' }}
        variant="outlined"
      />
      
      <Input
        label="Confirmar Contraseña"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        style={{ width: '100%' }}
        variant="outlined"
      />
      
      <Button type="submit">
        {isSubmitting ? "Restableciendo..." : "Restablecer Contraseña"}
      </Button>
      
      {message && <p>{message}</p>}
    </form>
  );
}

export default ResetPasswordConfirm;
