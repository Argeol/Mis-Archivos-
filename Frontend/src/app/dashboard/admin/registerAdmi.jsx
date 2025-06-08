"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function RegisterAdmin() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: async (newAdmi) => {
      return await axiosInstance.post("api/User/createAdmi", newAdmi);
    },
    onSuccess: (data) => {
      alert(data.message || "Administrador registrado correctamente.");
      queryClient.invalidateQueries(["admins"]);
      setEmail("");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error desconocido al registrar.";
      alert(errorMessage);
    },
  });

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, ingresa un correo válido.");
      return;
    }

 mutation.mutate({ email });
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
              disabled={mutation.isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 flex justify-end">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Registrando..." : "Registrar Administrador"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
