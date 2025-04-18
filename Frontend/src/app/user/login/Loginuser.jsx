"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";


async function Login(credentials) {
  const response = await axiosInstance.post("/api/User/Login", credentials);
  return response;
}

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña

  const loginMutation = useMutation({
    mutationFn: Login,
    onMutate: () => setLoading(true),
    onSuccess: (response) => {
      if (response.status === 200) {
        alert("token");
        router.push("../dashboard");
      }
    },
    onError: (err) => {
      console.error(err);
      setError(err.response ? err.response.data.message : "Error desconocido");
    },
    onSettled: () => setLoading(false),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { email, hashedPassword: password };
    loginMutation.mutate(credentials);
  };
  

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-r from-white to-white">
      <form
        className="shadow-2xl p-6 w-full max-w-sm rounded-xl bg-white"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-center mb-2">
          <motion.div
            animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <img
              className="w-24"
              alt="logo"
              src="/assets/img/bienesoft.webp"
            />
          </motion.div>
        </div>

        <h1 className="font-bold text-3xl text-center mb-4 mt-0">
          Iniciar Sesión
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <TextField
            label="Usuario"
            placeholder="ejemplo@gmail.com"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PermIdentityIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          <TextField
            label="Contraseña"
            placeholder="Contraseña"
            type={showPassword ? "text" : "password"} // Cambiar entre texto y password
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Cambiar el estado de visibilidad
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </div>
        <Button
          type="submit"
          className="mt-4 bg-blue-500 text-white hover:bg-gray-400 transition-colors duration-200 rounded-md mx-auto block"
          disabled={loading}
        >
          {loading ? "Iniciando..." : "Ingresar"}
        </Button>
        <div className="flex flex-col items-center mt-5 text-sm space-y-2">
          <a href="/user/reset" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
          <div className="flex space-x-2">
            <span className="text-gray-500">¿No tienes cuenta?</span>
            <a href="/user/register" className="text-blue-600 hover:underline">
              Crear cuenta
            </a>
          </div>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
