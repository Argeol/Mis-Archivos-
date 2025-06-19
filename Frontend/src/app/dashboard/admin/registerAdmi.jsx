"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function RegisterAdmin() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (newAdmi) => axiosInstance.post("api/User/createAdmi", newAdmi),
    onSuccess: (data) => {
      toast.success(data.message || "Administrador registrado correctamente.");
      queryClient.invalidateQueries(["admins"]);
      setEmail("");
      setShowLoading(false); // ocultamos spinner al terminar
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error desconocido al registrar.";
      toast.error(errorMessage, { duration: 5000 });
      setShowLoading(false);
    },
  });

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Por favor, ingresa un correo válido.");
      return;
    }

    setShowLoading(true); // mostramos spinner
    mutation.mutate({ email });

    // Garantizar al menos 3 segundos de spinner
    setTimeout(() => {
      // Solo ocultar si ya no está cargando la mutación
      if (!mutation.isPending) {
        setShowLoading(false);
      }
    }, 3000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-600/20 border-2">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#218EED]" />
              <Label htmlFor="email" className="font-medium">
                Correo del Administrador
              </Label>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="admin@correo.com"
              value={email}
              onChange={handleChange}
              className="border-blue-200 focus-visible:ring-blue-500"
              required
              disabled={mutation.isPending || showLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isPending || showLoading}
            className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto block w-full flex items-center justify-center gap-2"
          >
            {(mutation.isPending || showLoading) ? (
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
                Registrando...
              </>
            ) : (
              <>Registrar Administrador</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
