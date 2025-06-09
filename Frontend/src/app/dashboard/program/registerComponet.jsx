"use client";

import { useState } from "react";
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
import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react";

export default function RegisterProgram() {
  const queryClient = useQueryClient();
  const [programId, setProgramId] = useState("");
  const [programName, setProgramName] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  // 🔹 Obtener áreas usando React Query
  const {
    data: areas = [],
    isLoading: loadingAreas,
    error,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/Area/AllAreas");
      return response.data || [];
    },
  });

  // 🔹 Mutación para registrar un programa
  const mutation = useMutation({
    mutationFn: async (newProgram) => {
      return await axiosInstance.post("/api/Program/CreateProgram", newProgram);
    },
    onSuccess: () => {
      alert("Programa registrado exitosamente");
      setProgramId("");
      setProgramName("");
      setSelectedAreaId(null);
      queryClient.invalidateQueries(["programs"]);
    },
    onError: () => {
      alert(" Error al registrar el programa.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !programId.trim() ||
      isNaN(Number(programId)) ||
      !programName.trim() ||
      !selectedAreaId
    ) {
      alert("⚠️ Todos los campos son obligatorios y el ID debe ser un número.");
      return;
    }

    const newProgram = {
      program_Id: Number(programId),
      program_Name: programName.trim(),
      area_Id: Number(selectedAreaId),
    };

    mutation.mutate(newProgram);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-600/20 border-2">
      <div className="text-center pb-4 space-y-1">
        <img src="/assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-14" />
        <h2 className="text-xl font-bold uppercase">Centro Agropecuario “La Granja” SENA Espinal</h2>
        <p className="font-semibold text-sm">Registre nuevos programas de formación del SENA. Complete todos los campos requeridos para
          crear un nuevo programa.</p>
        <p className="text-xs font-medium italic text-gray-600">
          NOTA: Evite registrar programas duplicados. El sistema validará por nombre y área asociada.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#218EED]" />
                <Label htmlFor="programId" className="font-medium">
                  Codigo de Programa
                </Label>
              </div>
              <Input
                id="programId"
                type="number"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                placeholder="Ej: 12345"
                className="border-blue-200 focus-visible:ring-blue-500"
                required
                disabled={mutation.isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#218EED]" />
                <Label htmlFor="programName" className="font-medium">
                  Nombre del Programa
                </Label>
              </div>
              <Input
                id="programName"
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                placeholder="Ej: Desarrollo de Software"
                className="border-blue-200 focus-visible:ring-blue-500"
                required
                disabled={mutation.isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#218EED]" />
              <Label htmlFor="area" className="font-medium">
                Área de Formación
              </Label>
            </div>
            <Select
              value={selectedAreaId ? String(selectedAreaId) : ""}
              onValueChange={(value) => setSelectedAreaId(Number(value))}
              disabled={loadingAreas || mutation.isLoading}
              required
            >
              <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                <SelectValue placeholder="Seleccionar Área" />
              </SelectTrigger>
              <SelectContent>
                {error ? (
                  <SelectItem value="error" disabled>
                    ❌ Error al cargar áreas
                  </SelectItem>
                ) : areas.length > 0 ? (
                  areas.map((area) => (
                    <SelectItem key={area.area_Id} value={String(area.area_Id)}>
                      {area.area_Name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-data" disabled>
                    ⚠️ No hay áreas disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        <CardFooter className="dark:bg-green-900/20 border-blue-100 dark:border-blue-800 flex justify-end ">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Registrando..." : "Registrar Programa"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
