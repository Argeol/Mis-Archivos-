import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LockIcon from "@mui/icons-material/Lock";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// API Call como función
async function registerUser(body) {
  const response = await axiosInstance.post("/api/User/CreateUser", body);
  return response.data;
}

function Registeruser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAlertMessage({ type: "success", text: data.message });
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        setAlertMessage({
          type: "error",
          text: error.response.data.message || "Solicitud inválida",
        });
      } else {
        setAlertMessage({ type: "error", text: "Error al procesar la solicitud. Inténtalo más tarde." });
      }
    },
  });

  // Manejar envío de formulario
  async function handlerSubmit(event) {
    event.preventDefault();

    if (!email || !password || !userType || !confirmPassword) {
      setAlertMessage({ type: "error", text: "Todos los campos son requeridos" });
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage({ type: "error", text: "La contraseña y la confirmación no coinciden." });
      return;
    }

    const body = {
      email,
      hashedPassword: password,
      userType,
    };

    mutation.mutate(body);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white to-white">
      <form
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-2xl"
        onSubmit={handlerSubmit}
      >
        <div className="flex items-center space-x-4 justify-center mb-6">
          <h1 className="font-serif text-2xl font-bold">Registrar Usuario</h1>
          <motion.div
            animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <img className="w-16" alt="Logo" src="/assets/img/bienesoft.webp"/>
          </motion.div>
        </div>

        {alertMessage && (
          <Alert className={`mb-4 ${alertMessage.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
            <AlertTitle>{alertMessage.type === "success" ? "Éxito" : "Error"}</AlertTitle>
            <AlertDescription>{alertMessage.text}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <TextField
            label="Tipo de Usuario"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            select
            fullWidth
            required
          >
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Usuario">Aprendiz</MenuItem>
            <MenuItem value="Responsable">Responsable</MenuItem>
          </TextField>

          <TextField
            label="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PermIdentityIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escriba su contraseña"
            type="password"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita su contraseña"
            type="password"
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <Button
          type="submit"
          className="mt-4 bg-blue-500 text-white hover:bg-gray-400 transition-colors duration-200 rounded-md mx-auto block"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Registrando..." : "Registrar"}
        </Button>

        <div className="text-center mt-4">
          <a className="text-blue-500 hover:underline" href="/user/login">
            Ya tengo una cuenta
          </a>
        </div>
      </form>
    </main>
  );
}

export default Registeruser;
