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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function UpdateAdmin({ id }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState(true); // true = Activo
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Obtener datos del admin
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["admin", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/User/GetUser/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Actualizar estado cuando llegan datos
  useEffect(() => {
    if (adminData) {
      setEmail(adminData.email || "");
      setEstado(adminData.asset); // asset es el campo booleano de activo/inactivo
    }
  }, [adminData]);

  // Mutación para actualizar admin
  const updateMutation = useMutation({
    mutationFn: async (newData) => {
      await axiosInstance.put(`/api/User/UpdateEmail${id}`, newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setModalMessage("Admin actualizado con éxito.");
      setModalOpen(true);
    },
    onError: () => {
      setModalMessage("Error al actualizar el admin.");
      setModalOpen(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ email, asset: estado });
  };

  const toggleEstado = () => {
    setEstado((prev) => !prev);
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="border-blue-200 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Estado</Label>
                <Button
                  type="button"
                  onClick={toggleEstado}
                  variant={estado ? "default" : "outline"}
                  className={`w-full ${estado ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}
                >
                  {estado ? "Activo" : "Inactivo"}
                </Button>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="dark:bg-green-900/20 border-blue-100 dark:border-blue-800 flex justify-end">
          <Button type="submit" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? "Actualizando..." : "Actualizar Admin"}
          </Button>
        </CardFooter>
      </form>

      {/* ✅ Modal de confirmación */}
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
