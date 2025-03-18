"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";

export default function UpdateProgram() {
    const [programs, setPrograms] = useState([]); // Lista de programas
    const [programId, setProgramId] = useState(""); // ID del programa a actualizar
    const [programName, setProgramName] = useState(""); 
    const [selectedAreaId, setSelectedAreaId] = useState(""); 
    const [areas, setAreas] = useState([]); 
    const [loading, setLoading] = useState(false); 

    // Obtener programas y áreas al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programsRes, areasRes] = await Promise.all([
                    axiosInstance.get("/api/Program/AllPrograms"), 
                    axiosInstance.get("/api/Area/AllArea")
                ]);

                setPrograms(programsRes.data || []);
                setAreas(areasRes.data || []);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };
        fetchData();
    }, []);

    // Cargar datos cuando el usuario seleccione un programa
    const handleProgramSelect = (id) => {
        setProgramId(id);
        const selectedProgram = programs.find((p) => p.program_Id === Number(id));
        if (selectedProgram) {
            setProgramName(selectedProgram.program_Name);
            setSelectedAreaId(String(selectedProgram.area_Id));
        }
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!programId || !programName.trim() || !selectedAreaId) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const updatedProgram = {
            program_Id: Number(programId),
            program_Name: programName.trim(),
            area_Id: Number(selectedAreaId),
        };

        setLoading(true); 
        try {
            const response = await axiosInstance.put(`/api/Program/UpdateProgram/${programId}`, updatedProgram);
            if (response.status === 200) {
                alert("Programa actualizado exitosamente");
            }
        } catch (error) {
            console.error("Error al actualizar el programa:", error);
            alert("Error al actualizar el programa.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Actualizar Programa</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Selección de programa a actualizar */}
                <div>
                    <Label htmlFor="selectProgram">Seleccionar Programa</Label>
                    <Select value={programId} onValueChange={handleProgramSelect}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un programa" />
                        </SelectTrigger>
                        <SelectContent>
                            {programs.map((program) => (
                                <SelectItem key={program.program_Id} value={String(program.program_Id)}>
                                    {program.program_Name} {/* SOLO el nombre */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Mostrar solo el ID del programa seleccionado */}
                {programId && (
                    <div>
                        <Label htmlFor="programId">ID del Programa</Label>
                        <Input
                            id="programId"
                            type="text"
                            value={programId}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>
                )}

                {/* Nombre del programa */}
                <div>
                    <Label htmlFor="programName">Nombre del Programa</Label>
                    <Input
                        id="programName"
                        type="text"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {/* Área asociada */}
                <div>
                    <Label htmlFor="area">Área</Label>
                    <Select value={selectedAreaId} onValueChange={setSelectedAreaId} disabled={loading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un área" />
                        </SelectTrigger>
                        <SelectContent>
                            {areas.map((area) => (
                                <SelectItem key={area.area_Id} value={String(area.area_Id)}>
                                    {area.area_Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Botón de actualizar */}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar Programa"}
                </Button>
            </form>
        </div>
    );
}
