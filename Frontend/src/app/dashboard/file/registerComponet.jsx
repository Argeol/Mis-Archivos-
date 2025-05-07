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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Users, BookOpen, ClipboardList } from "lucide-react"

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
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-600/20 border-2">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#218EED]" />
                <Label htmlFor="file_Id" className="font-medium">
                  Codigo de Ficha
                </Label>
              </div>
              <Input
                id="file_Id"
                name="file_Id"
                placeholder="Ej: 2567890"
                onChange={handleChange}
                className="border-blue-200 focus-visible:ring-blue-500"
                required
              />
            </div>

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
                placeholder="Ej: 25"
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
                <Label htmlFor="start_Date" className="font-medium">
                  Fecha de Inicio
                </Label>
              </div>
              <Input
                id="start_Date"
                name="start_Date"
                type="date"
                onChange={handleChange}
                className="border-blue-200 focus-visible:ring-blue-500"
                required
              />
            </div>

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
                onChange={handleChange}
                className="border-blue-200 focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#218EED]" />
              <Label className="font-medium">Programa de Formación</Label>
            </div>
            <Select
              onValueChange={(value) => setFormData({ ...formData, program_Id: Number.parseInt(value) })}
              required
            >
              <SelectTrigger className="border-blue-200 focus:ring-blue-500">
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
          </div>
        </CardContent>

        <CardFooter className=" dark:bg-green-900/20  border-blue-100 dark:border-blue-800 flex justify-end pt-5">
          <Button type="submit" disabled={mutation.isLoading} >
            {mutation.isLoading ? "Registrando..." : "Registrar Ficha"}
          </Button>
        </CardFooter> 
      </form>
    </Card>
  );
}
