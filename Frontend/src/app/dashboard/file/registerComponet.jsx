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
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CalendarIcon, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";

const statusOptions = ["Activa", "Inactiva"];

export default function RegisterFile() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    file_Id: "",
    apprentice_count: "",
    start_Date: "",
    end_Date: "",
    program_Id: 0,
    status: "Activo",
  });

  // Mutación para Registrar Ficha
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/Api/File/CreateFile", formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast(data.message);
      queryClient.invalidateQueries(["files"]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido.";
      toast.error(errorMessage);
    },
  });

  const { data: program = [] } = useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      const res = await axiosInstance.get("/Api/Program/GetProgram");
      return res.data;
    },
  });

  // Manejo de Cambios en el Formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo selección programa
  const handleSelectProgram = (value) => {
    setFormData((prev) => ({ ...prev, program_Id: Number.parseInt(value) }));
  };

  // Enviar Formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-600/20 border-2">
        {/* Encabezado institucional */}
      <div className="text-center pb-4 space-y-1">
        <img src="/assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-14" />
        <h2 className="text-xl font-bold uppercase">Centro Agropecuario “La Granja” SENA Espinal</h2>
        <p className="font-semibold text-sm">Registre nuevas fichas para los programas de formación del SENA. Complete todos los campos requeridos para
              crear una nueva ficha.</p>
        <p className="text-xs font-medium italic">
          NOTA: Al momento que registres fichas el sistema va a buscar que ficha terminaron y asi mismo desactiva aprendices que ya no estan en el centro.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#218EED]" />
                <Label htmlFor="file_Id" className="font-medium">
                  Código de Ficha
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
            <Select onValueChange={handleSelectProgram} required>
              <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                <SelectValue placeholder="Seleccionar Programa" />
              </SelectTrigger>
              <SelectContent>
                {program.map((Program) => (
                  <SelectItem
                    key={Program.program_Id}
                    value={Program.program_Id.toString()}
                  >
                    {Program.program_Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="dark:bg-green-900/20 border-blue-100 dark:border-blue-800 flex justify-end pt-5">
          <Button
            type="submit"
            disabled={mutation.isLoading}
            className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto block w-full flex items-center justify-center gap-2"
          >
            {mutation.isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Registrando...
              </>
            ) : (
              <>Registrar Ficha</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
