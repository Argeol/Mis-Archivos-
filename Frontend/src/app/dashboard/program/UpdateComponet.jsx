"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { BookOpen } from "lucide-react";


export default function UpdateProgram({ id }) {
  const queryClient = useQueryClient();
  const [programName, setProgramName] = useState("");
  const [areaId, setAreaId] = useState("");

  // ✅ Obtener lista de áreas
  const { data: areas = [] } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/Area/AllAreas");
      // console.log("📌 Lista de áreas recibida:", response.data);
      return response.data;
    },
  });

  // ✅ Obtener datos del programa seleccionado
  const { data: programData, isLoading: isLoadingProgram } = useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/Program/ProgramGetId${id}`
      );
      // console.log("📌 Datos recibidos del programa:", response.data);
      return response.data;
    },
    enabled: !!id, // Solo ejecutar si hay un ID válido
  });

  // ✅ Actualizar el estado cuando `programData` cambie
  useEffect(() => {
    if (programData) {
      // console.log("✅ Actualizando estado con datos:", programData);

      // Buscar el área correspondiente
      const matchingArea = areas.find(
        (area) => area.area_Name === programData.area_Name
      );

      setProgramName(programData.program_Name || "");
      setAreaId(matchingArea ? matchingArea.area_Id.toString() : "");

      // console.log("🔄 Estado actualizado:", {
      //   programName: programData.program_Name || "",
      //   areaId: matchingArea ? matchingArea.area_Id : "",
      // });
    }
  }, [programData, areas]);

  // ✅ Mutación para actualizar el programa
  const updateMutation = useMutation({
    mutationFn: async (newData) => {
      await axiosInstance.put(`/api/Program/UpdateProgram/${id}`, newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["programs"]);
      alert("✅ Programa actualizado con éxito.");
    },
    onError: () => {
      alert("❌ Error al actualizar el programa.");
    },
  });

  // ✅ Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("📤 Enviando datos:", {
    //   program_Name: programName,
    //   area_Id: Number(areaId),
    // });
    updateMutation.mutate({
      program_Name: programName,
      area_Id: Number(areaId),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-blue-600/20 border-2">
      <div className="text-center pb-4 space-y-1">
        <img src="/assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-14" />
        <h2 className="text-xl font-bold uppercase">Centro Agropecuario “La Granja” SENA Espinal</h2>
        <p className="font-semibold text-sm">Actualice la información de los programas de formación del SENA. Puede modificar el nombre, área.</p>
        <p className="text-xs font-medium italic text-gray-600">
          NOTA: Solo se permiten cambios en programas que aún no tengan fichas asociadas activas.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          {isLoadingProgram ? (
            <p className="text-center text-blue-500">Cargando datos...</p>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#218EED]" />
                  <Label htmlFor="program_Name" className="font-medium">
                    Nombre del Programa
                  </Label>
                </div>
                <Input
                  id="program_Name"
                  name="program_Name"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="Nombre del programa"
                  className="border-blue-200 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#218EED]" />
                  <Label htmlFor="areaId" className="font-medium">
                    Área
                  </Label>
                </div>
                <Select
                  value={areaId}
                  onValueChange={(value) => setAreaId(value)}
                  required
                >
                  <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                    <SelectValue placeholder={programData.area_Name || "Sin programa seleccionado"} />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem
                        key={area.area_Id}
                        value={area.area_Id.toString()}
                      >
                        {area.area_Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="dark:bg-green-900/20 border-blue-100 dark:border-blue-800 flex justify-end ">
          <Button type="submit" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading
              ? "Actualizando..."
              : "Actualizar Programa"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}