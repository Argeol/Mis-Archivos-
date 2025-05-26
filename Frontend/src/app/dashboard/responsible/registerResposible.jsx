"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterResponsible() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    responsible_Id: 0,
    nom_Responsible: "",
    ape_Responsible: "",
    tel_Responsible: "",
    email_Responsible: "",
    roleId: 0,
    state: "Activo", 
  });

  const [localLoading, setLocalLoading] = useState(false); // ✅ Declarado correctamente

  // ✅ Mutación para Registrar Responsable
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/api/Responsible/CreateResponsible",
        formData
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast(data.message);
      queryClient.invalidateQueries(["responsables"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      toast(errorMessage);
    },
  });

  // ✅ Manejo de Cambios en el Formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Manejo del submit con localLoading
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    mutation.mutate(undefined, {
      onSettled: () => {
        setLocalLoading(false);
      },
    });
  };

  const { data: roles = [] } = useQuery({
    queryKey: ["Roles"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Role/GetRole");
      return res.data;
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8">
      <div>
        <Label htmlFor="responsible_Id">Número de Documento</Label>
        <Input
          name="responsible_Id"
          placeholder="Número de Documento"
          type="number"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="nom_Responsible">Nombre del Responsable</Label>
        <Input
          name="nom_Responsible"
          placeholder="Nombre del Responsable"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="ape_Responsible">Apellido del Responsable</Label>
        <Input
          name="ape_Responsible"
          placeholder="Apellido del Responsable"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="tel_Responsible">Teléfono</Label>
        <Input
          name="tel_Responsible"
          placeholder="Teléfono"
          type="tel"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="email_Responsible">Correo Electrónico</Label>
        <Input
          name="email_Responsible"
          placeholder="Correo"
          type="email"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="roleId">Rol</Label>
        <Select
          onValueChange={(value) =>
            setFormData({ ...formData, roleId: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id_role} value={role.id_role.toString()}>
                {role.name_role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={localLoading}
        className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto block w-full flex items-center justify-center gap-2"
      >
        {localLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Registrando...
          </>
        ) : (
          <>Registrar</>
        )}
      </Button>
    </form>
  );
}
