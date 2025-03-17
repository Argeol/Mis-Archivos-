"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";

export default function RegisterProgram() {
    const [programId, setProgramId] = useState(""); 
    const [programName, setProgramName] = useState("");
    const [selectedAreaId, setSelectedAreaId] = useState("");
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false); // Estado para manejar la carga

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axiosInstance.get("/api/Area/AllArea");
                if (response.status === 200) {
                    setAreas(response.data || []);
                }
            } catch (error) {
                console.error("Error al obtener áreas:", error);
            }
        };
        fetchAreas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!programId.trim() || isNaN(Number(programId)) || !programName.trim() || !selectedAreaId) {
            alert("Todos los campos son obligatorios y el ID debe ser un número.");
            return;
        }

        const newProgram = {
            program_Id: Number(programId),
            program_Name: programName.trim(),
            area_Id: Number(selectedAreaId),
        };

        setLoading(true); // Activar estado de carga
        try {
            const response = await axiosInstance.post("/api/Program/CreateProgram", newProgram);
            if (response.status === 200) {
                alert("Programa registrado exitosamente");
                setProgramId(""); 
                setProgramName("");
                setSelectedAreaId("");
            } else {
                alert("Registro completado, pero hubo un problema.");
            }
        } catch (error) {
            console.error("Error al registrar el programa:", error);
            alert("Error al registrar el programa.");
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Programa</h2>
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
                        disabled={loading} // Deshabilitar mientras carga
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
                        disabled={loading} // Deshabilitar mientras carga
                    />
                </div>

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

                {/* Botón de envío con estado de carga */}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar Programa"}
                </Button>
            </form>
        </div>
    );
}
