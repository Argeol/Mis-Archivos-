"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Cambio aquí

export default function UpdateFile({ id }) {
  const [formData, setFormData] = useState({});
  const [programs, setPrograms] = useState([]); // Lista de programas

  useEffect(() => {
    // Obtener los datos de la ficha
    axiosInstance.get(`/Api/File/${id}`)
      .then((res) => setFormData(res.data))
      .catch((error) => console.error("Error al obtener los datos de la ficha:", error));

    // Obtener la lista de programas
    axiosInstance.get("/api/Program/GetProgram")
      .then((res) => setPrograms(res.data))
      .catch((error) => console.error("Error al obtener los programas:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/Api/File/UpdateFile/${id}`,
        formData
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
        name="apprentice_count"
        type="number"
        value={formData.apprentice_count || ""}
        placeholder="Cantidad de aprendices"
        onChange={handleChange}
        required
      />
      <Input
        name="start_Date"
        type="date"
        value={formData.start_Date?.split("T")[0] || ""}
        onChange={handleChange}
        required
      />
      <Input
        name="end_Date"
        type="date"
        value={formData.end_Date?.split("T")[0] || ""}
        onChange={handleChange}
        required
      />
      
      <Select
        value={formData.program_Id?.toString() || ""}
        onValueChange={(value) => 
          setFormData((prev) => ({ ...prev, program_Id: Number(value) }))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar Programa" />
        </SelectTrigger>
        <SelectContent>
          {programs.map((program) => (
            <SelectItem key={program.program_Id} value={program.program_Id.toString()}>
              {program.program_Name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" className="right-3">Actualizar Ficha</Button>
    </form>
  );
}
