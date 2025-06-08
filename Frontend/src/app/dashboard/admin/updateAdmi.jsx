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
import { toast } from "sonner";

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
      const res = await axiosInstance.get(`/api/User/GetUser${id}`);
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
      const res = await axiosInstance.put(`/api/User/UpdateAdmi`, newData);
      return res.data; // Retornamos la respuesta para usar el mensaje
    },
    onSuccess: (data) => {
      toast(data.message); // Mensaje del backend si la actualización fue exitosa
      queryClient.invalidateQueries(["users"]);
      setModalMessage(data.message);
      setModalOpen(true);
    },
    onError: (error) => {
      const errMsg = error?.response?.data?.message || "Error desconocido al actualizar el admin.";
      toast(errMsg); // Mensaje del backend en caso de error
      setModalMessage(errMsg);
      setModalOpen(true);
    },
  });



  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({ user_Id: id, email });
  };


  const toggleEstado = () => {
    setEstado((prev) => !prev);
  };
  console.log(adminData)

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
