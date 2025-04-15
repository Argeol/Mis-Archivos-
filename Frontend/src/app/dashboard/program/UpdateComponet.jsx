"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateProgram({ id }) {
  const queryClient = useQueryClient();
  const [programName, setProgramName] = useState("");
  const [areaId, setAreaId] = useState("");

  // ✅ Obtener lista de áreas
  const { data: areas = [] } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/Area/AllAreas");
      console.log("📌 Lista de áreas recibida:", response.data);
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
      console.log("📌 Datos recibidos del programa:", response.data);
      return response.data;
    },
    enabled: !!id, // Solo ejecutar si hay un ID válido
  });

  // ✅ Actualizar el estado cuando `programData` cambie
  useEffect(() => {
    if (programData) {
      console.log("✅ Actualizando estado con datos:", programData);

      // Buscar el área correspondiente
      const matchingArea = areas.find(
        (area) => area.area_Name === programData.area_Name
      );

      setProgramName(programData.program_Name || "");
      setAreaId(matchingArea ? matchingArea.area_Id.toString() : "");

      console.log("🔄 Estado actualizado:", {
        programName: programData.program_Name || "",
        areaId: matchingArea ? matchingArea.area_Id : "",
      });
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
    console.log("📤 Enviando datos:", {
      program_Name: programName,
      area_Id: Number(areaId),
    });
    updateMutation.mutate({
      program_Name: programName,
      area_Id: Number(areaId),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      {isLoadingProgram ? (
        <p className="text-center text-blue-500">Cargando datos...</p>
      ) : (
        <>
          <Input
            name="program_Name"
            value={programName}
            placeholder="Nombre del programa"
            onChange={(e) => setProgramName(e.target.value)}
            required
          />
          <Select value={areaId} onValueChange={(value) => setAreaId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar Área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.area_Id} value={area.area_Id.toString()}>
                  {area.area_Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={updateMutation.isLoading}>
            {updateMutation.isLoading ? "Actualizando..." : "Actualizar"}
          </Button>
        </>
      )}
    </form>
  );
}
