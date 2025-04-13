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
      const res = await axiosInstance.post("/api/permission/CrearPermiso/", formData);
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
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 border rounded-2xl shadow-md bg-white space-y-4"
    >
      <h2 className="text-lg font-semibold text-center mb-4">
        Registrar Permiso
      </h2>

      <Input
        type="datetime-local"
        name="departureDate"
        onChange={handleChange}
        required
        className="text-sm md:text-base"
      />
      <Input
        type="datetime-local"
        name="entryDate"
        onChange={handleChange}
        required
        className="text-sm md:text-base"
      />
      {/* <Input
        type="datetime-local"
        name="applicationDate"
        onChange={handleChange}
        required
        className="text-sm md:text-base"
      /> */}

      <Input
        name="adress"
        placeholder="Dirección"
        onChange={handleChange}
        required
        className="text-sm md:text-base"
      />

      <Input
        name="destination"
        placeholder="Destino"
        onChange={handleChange}
        required
        className="text-sm md:text-base"
      />

      <Input
        name="motive"
        placeholder="Motivo del permiso"
        onChange={handleChange}
        required
        className="text-sm md:text-base"
      />

      <Textarea
        name="observation"
        placeholder="Observaciones"
        onChange={handleChange}
        className="text-sm md:text-base"
      />

      <Select onValueChange={handleSelectApprentice}>
        <SelectTrigger className="text-sm md:text-base">
          <SelectValue placeholder="Seleccionar Aprendiz" />
        </SelectTrigger>
        <SelectContent>
          {apprentices.map((a) => (
            <SelectItem
              key={a.id_Apprentice}
              value={a.id_Apprentice.toString()}
            >
              {a.first_Name_Apprentice} {a.last_Name_Apprentice}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full py-2 mt-2"
      >
        {mutation.isLoading ? "Registrando..." : "Registrar Permiso"}
      </Button>
    </form>
  );
}
