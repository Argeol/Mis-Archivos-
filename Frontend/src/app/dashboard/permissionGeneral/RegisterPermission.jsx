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

const roles = [
  { id: 1, label: "Instructor" },
  { id: 2, label: "Coordinador" },
  { id: 3, label: "Bienestar" },
  { id: 4, label: "Internado" }, // Este solo si aplica
];

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
    responsibleIds: {
      instructorId: null,
      coordinatorId: null,
      bienestarId: null,
      internadoId: null,
    },
  });

  const [currentStep, setCurrentStep] = useState(0);

  const { data: responsables = [] } = useQuery({
    queryKey: ["responsables", roles[currentStep]?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/Responsible/GetResponsiblesByRole/roleid=${roles[currentStep].id}`
      );
      return res.data;
    },
    enabled: currentStep < roles.length, // Solo cuando el paso es válido
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        ...formData.responsibleIds,
      };
      const res = await axiosInstance.post("/api/permission/CrearPermiso/", payload);
      return res.data;
    },
    onSuccess: () => {
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

  const handleResponsibleSelect = (value) => {
    const roleKey = [
      "instructorId",
      "coordinatorId",
      "bienestarId",
      "internadoId",
    ][currentStep];

    setFormData((prev) => ({
      ...prev,
      responsibleIds: {
        ...prev.responsibleIds,
        [roleKey]: parseInt(value),
      },
    }));

    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 bg-white space-y-4">
      {/* Campos del permiso */}
      {/* Fecha de salida */}
      <div className="space-y-1 px-2">
        <Label htmlFor="departureDate">Fecha de salida</Label>
        <Input
          id="departureDate"
          type="datetime-local"
          name="departureDate"
          onChange={handleChange}
          required
        />
      </div>

      {/* Fecha de entrada */}
      <div className="space-y-1 px-2">
        <Label htmlFor="entryDate">Fecha de entrada</Label>
        <Input
          id="entryDate"
          type="datetime-local"
          name="entryDate"
          onChange={handleChange}
          required
        />
      </div>

      {/* Dirección */}
      <div className="space-y-1 px-2">
        <Label htmlFor="adress">Dirección</Label>
        <Input
          id="adress"
          name="adress"
          placeholder="Dirección"
          onChange={handleChange}
          required
        />
      </div>

      {/* Destino */}
      <div className="space-y-1 px-2">
        <Label htmlFor="destination">Destino</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="Destino"
          onChange={handleChange}
          required
        />
      </div>

      {/* Motivo */}
      <div className="space-y-1 px-2">
        <Label htmlFor="motive">Motivo</Label>
        <Input
          id="motive"
          name="motive"
          placeholder="Motivo del permiso"
          onChange={handleChange}
          required
        />
      </div>

      {/* Observación */}
      <div className="space-y-1 px-2">
        <Label htmlFor="observation">Observaciones</Label>
        <Textarea
          id="observation"
          name="observation"
          placeholder="Observaciones"
          onChange={handleChange}
        />
      </div>

      {/* Flujo paso a paso para responsables */}
      {currentStep < roles.length && (
        <div className="space-y-2 px-2">
          <Label>Seleccionar {roles[currentStep].label}</Label>
          <Select onValueChange={handleResponsibleSelect}>
            <SelectTrigger>
              <SelectValue placeholder={`Seleccione un ${roles[currentStep].label}`} />
            </SelectTrigger>
            <SelectContent>
              {responsables?.map((respo) => (
                <SelectItem key={respo.id} value={respo.id.toString()}>
                  {respo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Botón de enviar solo cuando ya se seleccionaron todos los responsables */}
      {currentStep >= roles.length && (
        <div className="px-2">
          <Button type="submit" className="w-full py-2 mt-2" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Registrando..." : "Registrar Permiso"}
          </Button>
        </div>
      )}
    </form>
  );
}
