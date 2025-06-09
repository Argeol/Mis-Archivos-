"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function UpdateAdmin({ id }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Obtener datos del admin
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/User/GetUser${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Actualizar estado cuando llegan datos
  useEffect(() => {
    if (adminData) {
      setEmail(adminData.email || "");
    }
  }, [adminData]);

  // Mutación para actualizar admin
  const updateMutation = useMutation({
    mutationFn: async (newData) => {
      const res = await axiosInstance.put(`/api/User/UpdateAdmi`, newData);
      return res.data; // Retornamos la respuesta para usar el mensaje
    },
    onSuccess: (data) => {
      toast.success(data.message || "Administrador actualizado correctamente.");
      queryClient.invalidateQueries(["users"]);
      setShowLoading(false);
    },
    onError: (error) => {
      const errMsg = error?.response?.data?.message || "Error desconocido al actualizar el admin.";
      toast.error(errMsg);
      setShowLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Por favor, ingresa un correo válido.");
      return;
    }

    setShowLoading(true);
    updateMutation.mutate({ user_Id: id, email });

    // Garantizar mínimo 3 segundos de spinner
    setTimeout(() => {
      if (!updateMutation.isLoading) {
        setShowLoading(false);
      }
    }, 5000);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-600/20 border-2">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {isLoading ? (
            <p className="text-blue-500 text-center">Cargando datos...</p>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="border-blue-200 focus-visible:ring-blue-500"
                  required
                  disabled={updateMutation.isLoading || showLoading}
                />
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="dark:bg-green-900/20 border-blue-100 dark:border-blue-800 flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isLoading || showLoading}
            className="flex items-center justify-center gap-2"
          >
            {(updateMutation.isLoading || showLoading) ? (
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
                Actualizando...
              </>
            ) : (
              <>Actualizar Admin</>
            )}
          </Button>
        </CardFooter>
      </form>

      {/* Modal de confirmación */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-center space-y-4">
            <p>{modalMessage}</p>
            <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
