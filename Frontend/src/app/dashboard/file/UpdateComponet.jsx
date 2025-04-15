"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function UpdateFile({ id }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  // Obtener ficha
  const { data: fileData, isLoading: loadingFile } = useQuery({
    queryKey: ["file", id],
    queryFn: () =>
      axiosInstance.get(`Api/File/${id}`).then((res) => {
        console.log("Datos de la ficha:", res.data);
        return res.data;
      }),
    enabled: !!id, // solo si hay id
  });

  // Obtener programas
  const { data: programs = [], isLoading: loadingPrograms } = useQuery({
    queryKey: ["programs"],
    queryFn: () =>
      axiosInstance.get("/api/Program/GetProgram").then((res) => res.data),
  });

  // Mutación para actualizar ficha
  const updateMutation = useMutation({
    mutationFn: (updatedData) =>
      axiosInstance.put(`/Api/File/UpdateFile/${id}`, updatedData),
    onSuccess: (res) => {
      alert(res.data.message);
      queryClient.invalidateQueries(["file", id]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      alert(errorMessage);
    },
  });

  // Actualizar el estado cuando fileData cambia
  useEffect(() => {
    if (fileData) {
      setFormData(fileData);
    }
  }, [fileData]); // Solo cuando fileData cambia

  // Controlador de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envío de datos al backend
  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  // Mostrar loading si los datos aún no han llegado
  if (loadingFile || loadingPrograms) {
    return <p>Cargando datos de la ficha...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Input
        name="apprentice_count"
        type="number"
        value={formData.apprentice_count || ""}
        placeholder="Cantidad de aprendices"
        onChange={handleChange}
        required
      />
      <Input
        name="start_Date"
        type="date"
        value={formData.start_Date?.split("T")[0] || ""}
        onChange={handleChange}
        required
      />
      <Input
        name="end_Date"
        type="date"
        value={formData.end_Date?.split("T")[0] || ""}
        onChange={handleChange}
        required
      />
      <div className="text-sm">
        <strong>Programa: </strong>
        {formData.program_Name || "Sin programa seleccionado"}
      </div>
      <Select
        value={formData.program_Id?.toString() || ""}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, program_Id: Number(value) }))
        }
      >
        <SelectTrigger className="w-full">
          {/* Mostramos el nombre del programa si está seleccionado, de lo contrario, el placeholder */}
          <SelectValue
            placeholder={formData.program_Name || "Seleccionar Programa"}
          />
        </SelectTrigger>
        <SelectContent>
          {programs.map((program) => (
            <SelectItem
              key={program.program_Id}
              value={program.program_Id.toString()}
            >
              {program.program_Name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" disabled={updateMutation.isLoading}>
        {updateMutation.isLoading ? "Actualizando..." : "Actualizar Ficha"}
      </Button>
    </form>
  );
}
