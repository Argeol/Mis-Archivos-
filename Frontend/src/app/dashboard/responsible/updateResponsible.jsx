"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UpdateResponsible() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nom_Responsible: "",
    ape_Responsible: "",
    tel_Responsible: "",
    name_role: "",
    state: "",
    email_Responsible: "",
  });

  // Obtener datos del responsable actual desde un endpoint tipo "Me"
  const { data, isLoading } = useQuery({
    queryKey: ["responsible"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Responsible/GetResponsibleID"); // <-- debes tener este endpoint
      return res.data || {};
    },
  });

  useEffect(() => {
    if (useState) {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.put("/api/Responsible/UpdateResponsible", formData); // <-- sin ID en la URL
    },
    onSuccess: () => {
      alert("Responsable actualizado correctamente");
      queryClient.invalidateQueries(["responsible"]);
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
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Label>Estado: {formData.state}</Label>
      <hr />

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

      <Label>Email</Label>
      <Input
        type="email"
        name="Email_Responsible"
        value={formData.email_Responsible}
        onChange={handleChange}
        required
      />

      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Actualizando..." : "Actualizar"}
      </Button>
    </form>
  );
}
