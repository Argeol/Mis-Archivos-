"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
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
    const [formData, setFormData] = useState({ program_Name: "", area_Id: 0 });
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        // Obtener datos del programa
        axiosInstance.get(`/api/Program/${id}`).then((res) => {
            setFormData(res.data);
        });

        // Obtener lista de áreas
        axiosInstance.get("/api/Area/AllArea").then((res) => {
            setAreas(res.data);
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {};

            if (formData.program_Name.trim()) {
                payload.program_Name = formData.program_Name;
            }
            if (formData.area_Id !== 0) {
                payload.area_Id = formData.area_Id;
            }

            const response = await axiosInstance.put(
                `/api/Program/UpdateProgram/${id}`,
                payload
            );
            alert(response.data.message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error desconocido.";
            alert(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <Input
                name="program_Name"
                value={formData.program_Name || ""}
                placeholder="Nombre del programa"
                onChange={handleChange}
                required
            />
            <Select
                value={formData.area_Id ? formData.area_Id.toString() : ""}
                onValueChange={(value) => setFormData({ ...formData, area_Id: Number(value) })}
            >
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
            <Button type="submit">Actualizar</Button>
        </form>
    );
}
