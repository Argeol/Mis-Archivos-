"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = ["Activa", "Inactiva"];

export default function RegisterFile() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    file_Id: "",
    apprentice_count: "",
    start_Date: "",
    end_Date: "",
    program_Id: "",
    status: "Activo",
  });
  console.log(formData)

  // ✅ Mutación para Registrar Ficha
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/Api/File/CreateFile", formData);
      return res.data;
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries(["files"]); // 🔄 Refrescar lista de fichas
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Error desconocido.";
      alert(errorMessage);
    },
  });
  const { data: program = [] } = useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      const res = await axiosInstance.get("/Api/Program/GetProgram");
      return res.data;
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
      <Label>ID de Ficha</Label>
      <Input name="file_Id" placeholder="ID de la Ficha" onChange={handleChange} required />

      <Label>Cantidad de Aprendices</Label>
      <Input name="apprentice_count" type="number" placeholder="Cantidad" onChange={handleChange} required />

      <Label>Fecha de Inicio</Label>
      <Input name="start_Date" type="date" onChange={handleChange} required />

      <Label>Fecha de Finalización</Label>
      <Input name="end_Date" type="date" onChange={handleChange} required />
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, program_Id: parseInt(value) })
        }
      >
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar Programa" />
      </SelectTrigger>
      <SelectContent>
        {program.map((Program) => (
          <SelectItem key={Program.program_Id} value={Program.program_Id.toString()}>
            {Program.program_Name}
          </SelectItem>
        ))}
      </SelectContent>
      </Select>


      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Registrando..." : "Registrar Ficha"}
      </Button>
    </form>
  );
}
