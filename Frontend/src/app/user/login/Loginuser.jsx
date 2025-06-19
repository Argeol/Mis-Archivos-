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
import { useAuthUser } from "@/app/user/login/useCurrentUser";
import { toast } from "sonner"; // ✅ Importado toast

async function Login(credentials) {
  await new Promise((r) => setTimeout(r, 2000));
  const response = await axiosInstance.post("api/User/Login", credentials);
  console.log(response)
  return response;

}

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthUser();
  const [localLoading, setLocalLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: Login,
    onMutate: () => setLocalLoading(true),
    onSettled: () => setLocalLoading(false),
    onSuccess: (response) => {
      if (response.status === 200) {
        const { tip, user } = response.data;
        login({ user, tip });
        router.push("/dashboard");
      }
    },
    onError: (err) => {
      // console.error(err);
      const message =
        err.response?.data?.message || "Error desconocido. Intenta nuevamente.";
      toast.error(message); // ✅ Mostrando toast
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = {
      email: email.trim(),
      hashedPassword: password.trim(), // Aquí haces el cambio
    };
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
            <img className="w-24" alt="logo" src="/assets/img/bienesoft.webp" />
          </motion.div>
        </div>

        <h1 className="font-bold text-3xl text-center mb-4 mt-0">
          Iniciar Sesión
        </h1>

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
            type={showPassword ? "text" : "password"}
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
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Ver contraseña"
                    }
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
          disabled={localLoading}
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto w-full flex items-center justify-center gap-2"
        >
          {localLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Ingresando...
            </>
          ) : (
            <>Ingresar</>
          )}
        </Button>

        <div className="flex flex-col items-center mt-5 text-sm space-y-2">
          <a
            href="/user/reset-password/reset"
            className="text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
