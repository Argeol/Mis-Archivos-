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

  // ✅ Manejo del submit usando solo mutation
  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  const { data: roles = [] } = useQuery({
    queryKey: ["Roles"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Role/GetRole");
      return res.data;
    },
  });

  return (
    <>
      <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6 rounded-xl shadow-md border border-blue-300">
        <div className="text-center space-y-2">
          <img src="/assets/img/logoSena.png" alt="Logo SENA" className="mx-auto h-16" />
          <h2 className="text-2xl font-extrabold text-blue-800 uppercase tracking-wide">
            Registro de Responsables
          </h2>
          <p className="text-sm text-gray-700 font-medium max-w-xl mx-auto">
            Ingrese los datos del nuevo responsable institucional. Complete todos los campos obligatorios como nombre, correo, cargo y rol.
          </p>
          <p className="text-xs italic text-gray-600">
            NOTA: Un responsable no puede tener más de un rol por área funcional.
          </p>
        </div>
      </div>



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
          disabled={mutation.isPending}
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto block w-full flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
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
      <div className="mt-0 border-t pt-4 text-center text-sm text-gray-500">
        <p>© 2025 Centro Agropecuario “La Granja” - SENA Espinal</p>
        <p className="italic">Desarrollado por aprendices SENA - ADS0</p>
      </div>
      </form>

    </>
  );
}
