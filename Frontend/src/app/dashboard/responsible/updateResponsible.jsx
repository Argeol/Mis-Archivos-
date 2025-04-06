"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";

const statusOptions = ["Activo", "Inactivo"];

export default function UpdateResponsible({ id }) {
 
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nom_Responsible: "",
    ape_Responsible: "",
    tel_Responsible: "",
    roleId: 0,
    state:""
   
  });

  // Obtener datos del responsable
  const { data, isLoading } = useQuery({
    queryKey: ["responsible", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/Responsible/${id}`);
      return res.data || {};
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  }, [data]);

  // Obtener roles
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Role/GetRole");
      return res.data;
    },
  });

  // Mutación para actualizar responsable
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Enviando datos:", formData);
      await axiosInstance.put(`/api/Responsible/UpdateResponsible/${id}`,formData);
    },
    onSuccess: () => {
      alert("Responsable actualizado correctamente");
      queryClient.invalidateQueries(["responsible", id]);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Error al actualizar");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <p>Cargando datos del responsable...</p>;
  if (!formData || Object.keys(formData).length === 0)
    return <p>No se encontraron datos para el responsable.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Label>Nombre</Label>
      <Input
        name="nom_Responsible"
        value={formData.nom_Responsible}
        onChange={handleChange}
        required
      />

      <Label>Apellido</Label>
      <Input
        name="ape_Responsible"
        value={formData.ape_Responsible}
        onChange={handleChange}
        required
      />

      <Label>Teléfono</Label>
      <Input
        type="tel"
        name="tel_Responsible"
        value={formData.tel_Responsible}
        onChange={handleChange}
        required
      />

      <Label>Rol</Label>
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, roleId: parseInt(value) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Rol" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id_role} value={role.id_role.toString()}>
              {role.name_role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Estado</Label>
      <Select
        value={formData.state}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, state: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Estado" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Actualizando..." : "Actualizar"}
      </Button>
    </form>
  );
}
