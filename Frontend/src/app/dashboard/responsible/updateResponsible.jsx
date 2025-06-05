"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function UpdateResponsible() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    nom_Responsible: "",
    ape_Responsible: "",
    tel_Responsible: "",
    name_role: "",
    state: "",
    email_Responsible: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["responsible"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Responsible/GetResponsibleID");
      return res.data || {};
    },
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.put("/api/Responsible/UpdateResponsible", formData);
    },
    onSuccess: () => {
      toast("Responsable actualizado correctamente");
      queryClient.invalidateQueries(["responsible"]);
    },
    onError: (error) => {
      toast(error.response?.data?.message || "Error al actualizar");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <p>Cargando datos del responsable...</p>;
  if (!formData || Object.keys(formData).length === 0)
    return <p>No se encontraron datos para el responsable.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Label>Estado: {formData.state}</Label>
      <hr />

      <Label>Nombre</Label>
      <Input
        name="nom_Responsible"
        value={formData.nom_Responsible}
        onChange={handleChange}
        required
      />

      <Label>Apellido</Label>
      <Input
        name="ape_Responsible"
        value={formData.ape_Responsible}
        onChange={handleChange}
        required
      />

      <Label>Teléfono</Label>
      <Input
        type="tel"
        name="tel_Responsible"
        value={formData.tel_Responsible}
        onChange={handleChange}
        required
      />

      <Label>Email</Label>
      <Input
        type="email"
        name="email_Responsible"
        value={formData.email_Responsible}
        onChange={handleChange}
        required
      />

      <Button
        type="submit"
        disabled={mutation.isLoading}
        className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto block w-full flex items-center justify-center gap-2"
      >
        {mutation.isLoading ? (
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
            Actualizando...
          </>
        ) : (
          <>Actualizar</>
        )}
      </Button>
    </form>
  );
}
