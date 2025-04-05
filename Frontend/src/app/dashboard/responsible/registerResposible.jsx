"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterResponsible() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    responsible_Id: 0,
    nom_Responsible: "",
    ape_Responsible: "",
    tel_Responsible: "",
    roleId: 0,
    state: "Activo",
  });

  // ✅ Mutación para Registrar Responsable
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/api/Responsible/CreateResponsible",
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries(["responsables"]); // 🔄 Refrescar lista de responsables
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      alert(errorMessage);
    },
  });

  // ✅ Manejo de Cambios en el Formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Enviar Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(); // Ejecutar la mutación
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Input
        name="nom_Responsible"
        placeholder="Nombre del Responsable"
        onChange={handleChange}
        required
      />
      <Input
        name="ape_Responsible"
        placeholder="Apellido del Responsable"
        onChange={handleChange}
        required
      />
      <Input
        name="tel_Responsible"
        placeholder="Teléfono"
        type="tel"
        onChange={handleChange}
        required
      />
      <Input
        name="roleId"
        placeholder="ID de Rol"
        type="number"
        onChange={handleChange}
        required
      />
      <Input
        name="state"
        placeholder="Estado"
        onChange={handleChange}
        required
      />
      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Registrando..." : "Registrar"}
      </Button>
    </form>
  );
}
