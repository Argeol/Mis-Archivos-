"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AtIcon from "@mui/icons-material/AlternateEmail";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function resetPasswordRequest(data) {
  const response = await axiosInstance.post("/api/User/ResetPassUser", data);
  return response;
}

function ResetPassword() {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success(res.data.message || "Correo enviado correctamente.");
        setEmail("");
      }
    },
    onError: (err) => {
      const errMsg = err?.response?.data?.message || "Ocurrió un error";
      toast.error(errMsg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        className="shadow-lg p-6 bg-white rounded-lg max-w-sm w-full"
        onSubmit={handleSubmit}
      >
        {/* LOGO ANIMADO */}
        <div className="flex justify-center mb-2">
          <motion.div
            animate={{ y: [0, -5, 0], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <img className="w-20" alt="logo" src="/assets/img/bienesoft.webp" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-semibold mb-3 text-center">
          Recuperación de Cuenta
        </h2>
        <p className="mb-4 text-sm text-gray-700 text-center">
          Ingrese su correo electrónico para recuperar su cuenta
        </p>

        <TextField
          label="Email"
          placeholder="Correo electrónico"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AtIcon />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />

        <Button
          type="submit"
          className="mt-4 bg-blue-500 text-white hover:bg-gray-400 transition-colors duration-200 rounded-md mx-auto flex items-center justify-center gap-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
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
              Enviando...
            </>
          ) : (
            "Restablecer contraseña"
          )}
        </Button>

        <div className="mt-4 text-center text-sm">
          <a className="text-blue-700 hover:underline" href="/user/login">
            Volver a inicio
          </a>
        </div>
      </form>
    </main>
  );
}

export default ResetPassword;
