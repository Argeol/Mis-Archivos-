"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPermission() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    departureDate: "",
    entryDate: "",
    adress: "",
    destination: "",
    motive: "",
    observation: "",
    status: 0,
    id_Apprentice: 0,
  });

  // ✅ Obtener lista de aprendices
  const { data: apprentices = [] } = useQuery({
    queryKey: ["apprentices"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Apprentice/all");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/api/permission/CrearPermiso/",
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      alert("Permiso registrado exitosamente");
      queryClient.invalidateQueries(["permissions"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error al registrar el permiso.";
      alert(errorMessage);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectApprentice = (value) => {
    setFormData((prev) => ({
      ...prev,
      id_Apprentice: parseInt(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 bg-white space-y-4">
      <div className="space-y-1 px-2">
        <Label htmlFor="departureDate" className="text-left">
          Fecha de salida
        </Label>
        <Input
          id="departureDate"
          type="datetime-local"
          name="departureDate"
          onChange={handleChange}
          required
          className="w-full text-sm md:text-base"
        />
      </div>

      <div className="space-y-1 px-2">
        <Label htmlFor="entryDate" className="text-left">
          Fecha de entrada
        </Label>
        <Input
          id="entryDate"
          type="datetime-local"
          name="entryDate"
          onChange={handleChange}
          required
          className="w-full text-sm md:text-base"
        />
      </div>

      <div className="space-y-1 px-2">
        <Label htmlFor="adress" className="text-left">
          Dirección
        </Label>
        <Input
          id="adress"
          name="adress"
          placeholder="Dirección"
          onChange={handleChange}
          required
          className="w-full text-sm md:text-base"
        />
      </div>

      <div className="space-y-1 px-2">
        <Label htmlFor="destination" className="text-left">
          Destino
        </Label>
        <Input
          id="destination"
          name="destination"
          placeholder="Destino"
          onChange={handleChange}
          required
          className="w-full text-sm md:text-base"
        />
      </div>

      <div className="space-y-1 px-2">
        <Label htmlFor="motive" className="text-left">
          Motivo
        </Label>
        <Input
          id="motive"
          name="motive"
          placeholder="Motivo del permiso"
          onChange={handleChange}
          required
          className="w-full text-sm md:text-base"
        />
      </div>

      <div className="space-y-1 px-2">
        <Label htmlFor="observation" className="text-left">
          Observaciones
        </Label>
        <Textarea
          id="observation"
          name="observation"
          placeholder="Observaciones"
          onChange={handleChange}
          className="w-full text-sm md:text-base"
        />
      </div>

      <div className="space-y-1 px-2">
        <Label className="text-left">Aprendiz</Label>
        <Select onValueChange={handleSelectApprentice}>
          <SelectTrigger className="w-full text-sm md:text-base">
            <SelectValue placeholder="Seleccionar Aprendiz" />
          </SelectTrigger>
          <SelectContent>
            {apprentices.map((a) => (
              <SelectItem
                key={a.id_Apprentice}
                value={a.id_Apprentice.toString()}
                className="text-sm"
              >
                {a.first_Name_Apprentice} {a.last_Name_Apprentice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="px-2">
        <Button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full py-2 mt-2"
        >
          {mutation.isLoading ? "Registrando..." : "Registrar Permiso"}
        </Button>
      </div>
    </form>
  );
}
