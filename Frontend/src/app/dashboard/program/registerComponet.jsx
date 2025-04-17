"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function RegisterProgram() {
    const queryClient = useQueryClient();
    const [programId, setProgramId] = useState(""); 
    const [programName, setProgramName] = useState("");
    const [selectedAreaId, setSelectedAreaId] = useState(null);

    // 🔹 Obtener áreas usando React Query
    const { data: areas = [], isLoading: loadingAreas, error } = useQuery({
        queryKey: ["areas"],
        queryFn: async () => {
            const response = await axiosInstance.get("/api/Area/AllAreas");
            return response.data || [];
        }
    });

    // 🔹 Mutación para registrar un programa
    const mutation = useMutation({
        mutationFn: async (newProgram) => {
            return await axiosInstance.post("/api/Program/CreateProgram", newProgram);
        },
        onSuccess: () => {
            alert("✅ Programa registrado exitosamente");
            setProgramId("");
            setProgramName("");
            setSelectedAreaId(null);
            queryClient.invalidateQueries(["programs"]);
        },
        onError: () => {
            alert("❌ Error al registrar el programa.");
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!programId.trim() || isNaN(Number(programId)) || !programName.trim() || !selectedAreaId) {
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
        <div className="p-8 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="programId">ID del Programa</Label>
                    <Input
                        id="programId"
                        type="number"
                        value={programId}
                        onChange={(e) => setProgramId(e.target.value)}
                        placeholder="Ingrese el ID del programa"
                        required
                        disabled={mutation.isLoading} 
                    />
                </div>

                <div>
                    <Label htmlFor="programName">Nombre del Programa</Label>
                    <Input
                        id="programName"
                        type="text"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        placeholder="Ingrese el nombre"
                        required
                        disabled={mutation.isLoading} 
                    />
                </div>

                <div>
                    <Label htmlFor="area">Área</Label>
                    <Select 
                        value={selectedAreaId ? String(selectedAreaId) : undefined} 
                        onValueChange={(value) => setSelectedAreaId(Number(value))}
                        disabled={loadingAreas || mutation.isLoading}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar Área" />
                        </SelectTrigger>
                        <SelectContent>
                            {error ? (
                                <SelectItem value="error" disabled>❌ Error al cargar áreas</SelectItem>
                            ) : areas.length > 0 ? (
                                areas.map((area) => (
                                    <SelectItem key={area.area_Id} value={String(area.area_Id)}>
                                        {area.area_Name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-data" disabled>⚠️ No hay áreas disponibles</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isLoading}>
                    {mutation.isLoading ? "Registrando..." : "Registrar Programa"}
                </Button>
            </form>
        </div>
    );
}