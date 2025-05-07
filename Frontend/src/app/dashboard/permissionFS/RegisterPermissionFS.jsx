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

export default function RegisterPermissionFS() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    apprentice_Id: 0,
    destino: "",
    fec_Diligenciado: "",
    fec_Salida: "",
    fec_Entrada: "",
    dia_Salida: "Miercoles",
    alojamiento: "",
    sen_Empresa: "Si",
    direccion: "",
  });

  const { data: apprentices = [] } = useQuery({
    queryKey: ["apprentices"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Apprentice/all");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/api/PermissionFS", formData);
      return res.data;
    },
    onSuccess: () => {
      alert("Permiso FS registrado exitosamente");
      queryClient.invalidateQueries(["permissionsfs"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error al registrar el permiso FS.";
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
      apprentice_Id: parseInt(value),
    }));
  };

  const handleSelectDiaSalida = (value) => {
    setFormData((prev) => ({
      ...prev,
      dia_Salida: value,
    }));
  };

  const handleSelectSenEmpresa = (value) => {
    setFormData((prev) => ({
      ...prev,
      sen_Empresa: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 bg-white space-y-4">

      {/* Fecha diligenciado */}
      <div className="space-y-1 px-2">
        <Label htmlFor="fec_Diligenciado">Fecha de diligenciamiento</Label>
        <Input
          id="fec_Diligenciado"
          name="fec_Diligenciado"
          type="date"
          onChange={handleChange}
          required
        />
      </div>

      {/* Fecha salida */}
      <div className="space-y-1 px-2">
        <Label htmlFor="fec_Salida">Fecha de salida</Label>
        <Input
          id="fec_Salida"
          name="fec_Salida"
          type="date"
          onChange={handleChange}
          required
        />
      </div>

      {/* Fecha entrada */}
      <div className="space-y-1 px-2">
        <Label htmlFor="fec_Entrada">Fecha de entrada</Label>
        <Input
          id="fec_Entrada"
          name="fec_Entrada"
          type="date"
          onChange={handleChange}
          required
        />
      </div>

      {/* Destino */}
      <div className="space-y-1 px-2">
        <Label htmlFor="destino">Destino</Label>
        <Input
          id="destino"
          name="destino"
          placeholder="Destino"
          onChange={handleChange}
          required
        />
      </div>

      {/* Alojamiento */}
      <div className="space-y-1 px-2">
        <Label htmlFor="alojamiento">Alojamiento</Label>
        <Input
          id="alojamiento"
          name="alojamiento"
          placeholder="Alojamiento"
          onChange={handleChange}
        />
      </div>

      {/* Dirección */}
      <div className="space-y-1 px-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          name="direccion"
          placeholder="Dirección"
          onChange={handleChange}
        />
      </div>

      {/* Día de salida */}
      <div className="space-y-1 px-2">
        <Label>Día de salida</Label>
        <Select onValueChange={handleSelectDiaSalida} defaultValue="Miercoles">
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar día" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Miercoles">Miércoles</SelectItem>
            <SelectItem value="Fin de semana">Fin de semana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ¿Sale para empresa o SENA? */}
      <div className="space-y-1 px-2">
        <Label>SENA o Empresa</Label>
        <Select onValueChange={handleSelectSenEmpresa} defaultValue="Si">
          <SelectTrigger>
            <SelectValue placeholder="¿Sale para empresa?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Si">Sí</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Aprendiz */}
      <div className="space-y-1 px-2">
        <Label>Aprendiz</Label>
        <Select onValueChange={handleSelectApprentice}>
          <SelectTrigger>
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
      </div>

      <div className="px-2">
        <Button type="submit" disabled={mutation.isLoading} className="w-full">
          {mutation.isLoading ? "Registrando..." : "Registrar Permiso FS"}
        </Button>
      </div>
    </form>
  );
}
