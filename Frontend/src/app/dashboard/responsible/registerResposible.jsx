"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tips = ["Activo", "Inactivo"];

export default function RegisterResponsible() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    responsible_Id: 0,
    nom_Responsible: "",
    ape_Responsible: "",
    tel_Responsible: "",
    roleId: 0,
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

  const { data: roles = [] } = useQuery({
    queryKey: ["Roles"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Role/GetRole");
      return res.data;
    },
  });
  console.log(roles)

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
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, roleId: parseInt(value) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Ficha" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem 
            key={role.id_role} 
            value={role.id_role.toString()}
            >
              {role.name_role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => setFormData({ ...formData, state: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          {tips.map((tip) => (
            <SelectItem key={tip} value={tip}>
              {tip}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Registrando..." : "Registrar"}
      </Button>
    </form>
  );
}
