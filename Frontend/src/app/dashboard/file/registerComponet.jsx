"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";

export default function RegisterFile() {
    const [fileId, setFileId] = useState("");
    const [apprenticeCount, setApprenticeCount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedProgramId, setSelectedProgramId] = useState("");
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axiosInstance.get("/api/Program/AllPrograms");
                if (response.status === 200) {
                    setPrograms(response.data || []);
                }
            } catch (error) {
                console.error("Error al obtener programas:", error);
            }
        };
        fetchPrograms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fileId.trim() || isNaN(Number(fileId)) || !apprenticeCount.trim() || isNaN(Number(apprenticeCount)) || !startDate || !endDate || !selectedProgramId) {
            alert("Todos los campos son obligatorios y deben tener valores válidos.");
            return;
        }

        const newFile = {
            file_Id: Number(fileId),
            apprentice_count: Number(apprenticeCount),
            start_Date: startDate,
            end_Date: endDate,
            program_Id: Number(selectedProgramId),
        };

        setLoading(true);
        try {
            const response = await axiosInstance.post("/api/File/CreateFile", newFile);
            if (response.status === 200) {
                alert("Archivo registrado exitosamente");
                // Limpiar campos
                setFileId("");
                setApprenticeCount("");
                setStartDate("");
                setEndDate("");
                setSelectedProgramId("");
            } else {
                alert("Registro completado, pero hubo un problema.");
            }
        } catch (error) {
            console.error("Error al registrar el archivo:", error);
            alert("Error al registrar el archivo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Archivo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="fileId">ID del Archivo</Label>
                    <Input
                        id="fileId"
                        type="number"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                        placeholder="Ingrese el ID del archivo"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="apprenticeCount">Cantidad de Aprendices</Label>
                    <Input
                        id="apprenticeCount"
                        type="number"
                        value={apprenticeCount}
                        onChange={(e) => setApprenticeCount(e.target.value)}
                        placeholder="Ingrese la cantidad"
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="startDate">Fecha de Inicio</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="endDate">Fecha de Fin</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <Label htmlFor="program">Programa</Label>
                    <Select value={selectedProgramId} onValueChange={setSelectedProgramId} disabled={loading}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un programa" />
                        </SelectTrigger>
                        <SelectContent>
                            {programs.map((program) => (
                                <SelectItem key={program.program_Id} value={String(program.program_Id)}>
                                    {program.program_Name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar Archivo"}
                </Button>
            </form>
        </div>
    );
}