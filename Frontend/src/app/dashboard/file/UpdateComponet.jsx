"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Users, BookOpen, ClipboardList } from "lucide-react"

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
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-600/20 border-2">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#218EED]" />
                <Label htmlFor="apprentice_count" className="font-medium">
                  Cantidad de Aprendices
                </Label>
              </div>
              <Input
                id="apprentice_count"
                name="apprentice_count"
                type="number"
                value={formData.apprentice_count || ""}
                placeholder="Ej: 25"
                onChange={handleChange}
                className="border-blue-200 focus-visible:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#218EED]" />
                <Label htmlFor="start_Date" className="font-medium">
                  Fecha de Inicio
                </Label>
              </div>
              <Input
                id="start_Date"
                name="start_Date"
                type="date"
                value={formData.start_Date?.split("T")[0] || ""}
                onChange={handleChange}
                className="border-blue-200 focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#218EED]" />
                <Label htmlFor="end_Date" className="font-medium">
                  Fecha de Finalización
                </Label>
              </div>
              <Input
                id="end_Date"
                name="end_Date"
                type="date"
                value={formData.end_Date?.split("T")[0] || ""}
                onChange={handleChange}
                className="border-blue-200 focus-visible:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#218EED]" />
                <Label className="font-medium">Programa de Formación</Label>
                
              </div>
              <Select
                value={formData.program_Id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    program_Id: Number(value),
                  }))
                }
                required
              >
                <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                  <SelectValue
                    placeholder={
                      formData.program_Name || "Seleccionar Programa"
                    }
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
            </div>
          </div>
          <p className="flex justify-center ">{formData.program_Name || "Sin programa seleccionado"}</p>
        </CardContent>

        <CardFooter className="dark:bg-green-900/20 border-blue-100 dark:border-blue-800 flex justify-end ">
          <Button type="submit" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? "Actualizando..." : "Actualizar Ficha"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
