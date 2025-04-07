"use client";

import { useState, useEffect } from "react";
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

const genders = ["masculino", "femenino", "otro"];
const addressTypes = ["Barrio", "Vereda", "Corregimiento", "Comuna"];
const apprenticeTypes = ["interno", "externo"];
const statusOptions = ["Active", "Inactive"];

export default function UpdateApprentice({ id }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id_Apprentice: id,
    first_Name_Apprentice: "",
    last_Name_Apprentice: "",
    birth_date_apprentice: new Date().toISOString(),
    gender_Apprentice: "",
    email_Apprentice: "",
    address_Apprentice: "",
    address_Type_Apprentice: "",
    phone_Apprentice: "",
    status_Apprentice: "Activo",
    permission_Count_Apprentice: 0,
    tip_Apprentice: "",
    doc_apprentice: "",
    nom_responsible: "",
    ape_responsible: "",
    tel_responsible: "",
    email_responsible: "",
    file_Id: 0,
    id_Municipality: 0,
  });

  const [id_department, setDepartmentId] = useState(null); // Guardamos el ID del departamento temporalmente

  // Obtener datos del aprendiz
  const { data, isLoading } = useQuery({
    queryKey: ["apprentice", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/Apprentice/${id}`);
      return res.data.apprentice || {};
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        birth_date_apprentice: data.birth_date_apprentice
          ? new Date(data.birth_date_apprentice).toISOString()
          : new Date().toISOString(),
      }));
      setDepartmentId(data.id_department || null); // Asignamos el departamento temporalmente
    }
  }, [data]);

  // Obtener Departamentos
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Department");
      return res.data;
    },
  });

  // Obtener Municipios según el departamento seleccionado
  const { data: municipalities = [] } = useQuery({
    queryKey: ["municipalities", id_department],
    queryFn: async () => {
      if (!id_department) return [];
      const res = await axiosInstance.get(
        `/api/Municipality/byDepartment/${id_department}`
      );
      return res.data;
    },
    enabled: !!id_department,
  });

  // Mutación para actualizar aprendiz
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("Enviando datos:", formData);
      await axiosInstance.put(`/api/Apprentice/UpdateApprentice/${id}`, formData);
    },
    onSuccess: () => {
      alert("Aprendiz actualizado correctamente");
      queryClient.invalidateQueries(["apprentice", id]);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Error al actualizar");
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

  if (isLoading) return <p>Cargando datos del aprendiz...</p>;
  if (!formData || Object.keys(formData).length === 0)
    return <p>No se encontraron datos para el aprendiz.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Label>Nombre</Label>
      <Input name="first_Name_Apprentice" value={formData.first_Name_Apprentice} onChange={handleChange} required />

      <Label>Apellido</Label>
      <Input name="last_Name_Apprentice" value={formData.last_Name_Apprentice} onChange={handleChange} required />

      <Label>Email</Label>
      <Input name="email_Apprentice" value={formData.email_Apprentice} onChange={handleChange} required />

      <Label>Fecha de nacimiento</Label>
      <Input
        type="date"
        name="birth_date_apprentice"
        value={formData.birth_date_apprentice.split("T")[0]}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            birth_date_apprentice: new Date(e.target.value).toISOString(),
          }))
        }
        required
      />

      <Label>Género</Label>
      <Select
        value={formData.gender_Apprentice}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, gender_Apprentice: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Género" />
        </SelectTrigger>
        <SelectContent>
          {genders.map((gender) => (
            <SelectItem key={gender} value={gender}>
              {gender}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Departamento</Label>
      <Select
        value={id_department?.toString() || ""}
        onValueChange={(value) => {
          setDepartmentId(parseInt(value)); // Se guarda temporalmente
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Departamento" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id_department} value={dept.id_department.toString()}>
              {dept.name_department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Municipio</Label>
      <Select
        value={formData.id_municipality?.toString() || ""}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, id_municipality: parseInt(value) }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Municipio" />
        </SelectTrigger>
        <SelectContent>
          {municipalities.map((mun) => (
            <SelectItem key={mun.id_municipality} value={mun.id_municipality.toString()}>
              {mun.municipality}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Estado</Label>
      <Select
        value={formData.status_Apprentice}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, status_Apprentice: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Estado" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Actualizando..." : "Actualizar"}
      </Button>
    </form>
  );
}
