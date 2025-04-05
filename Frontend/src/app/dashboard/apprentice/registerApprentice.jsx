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

const genders = ["masculino", "femenino", "otro"];
const addressTypes = ["Barrio", "Vereda", "Corregimiento", "Comuna"];
const tips = ["interno", "externo"];

export default function RegisterApprentice() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id_Apprentice: 0,
    first_Name_Apprentice: "",
    last_Name_Apprentice: "",
    birth_Date_Apprentice: "",
    gender_Apprentice: "",
    email_Apprentice: "",
    address_Apprentice: "",
    address_Type_Apprentice: "",
    phone_Apprentice: "",
    status_Apprentice: "Active",
    permission_Count_Apprentice: 0,
    tip_Apprentice: "",
    file_id: 0,
    Id_municipality: 0,
    doc_apprentice: "",
    nom_responsible: "",
    ape_responsible: "",
    tel_responsible: "",
    email_responsible: "",
  });
  
  

  const [id_department, setDepartmentId] = useState(null); // Estado del departamento seleccionado

  // ✅ Obtener Departamentos
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Department");
      return res.data;
    },
  });

  // ✅ Obtener Fichas
  const { data: files = [] } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const res = await axiosInstance.get("/Api/File/Getfiles");
      return res.data;
    },
  });

  // ✅ Obtener Municipios por Departamento
  const { data: municipalities = [] } = useQuery({
    queryKey: ["municipalities", id_department],
    queryFn: async () => {
      if (!id_department) return []; // Evita llamadas innecesarias
      const res = await axiosInstance.get(
        `/api/Municipality/byDepartment/${id_department}`
      );
      console.log("Municipios obtenidos:", res.data);
      return res.data;
    },
    enabled: !!id_department, // 🔥 Ahora sí carga al seleccionar un departamento
  });

  // ✅ Mutación para Registrar Aprendiz
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        "/api/Apprentice/CreateApprentice",
        formData,
        console.log(formData)
      );
      return res.data;
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries(["apprentices"]); // 🔄 Refrescar lista de aprendices
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      alert(errorMessage);
    },
  });

  // ✅ Manejo de Cambios en el Formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Cambiar Departamento y Cargar Municipios
  const handleDepartmentChange = (value) => {
    const departmentId = parseInt(value);
    setDepartmentId(departmentId); // Guarda el ID para consulta
    setFormData((prev) => ({ ...prev, municipality_Id: 0 })); // Reinicia municipio
  };

  // ✅ Enviar Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(); // Ejecutar la mutación
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Input
        name="first_Name_Apprentice"
        placeholder="Nombre"
        onChange={handleChange}
        required
      />
      <Input
        name="last_Name_Apprentice"
        placeholder="Apellido"
        onChange={handleChange}
        required
      />
      <Input
        name="birth_Date_Apprentice"
        type="date"
        onChange={handleChange}
        required
      />
      <Input
        name="email_Apprentice"
        placeholder="Correo"
        type="email"
        onChange={handleChange}
        required
      />
      <Input
        name="phone_Apprentice"
        placeholder="Teléfono"
        onChange={handleChange}
        required
      />

      {/* Género */}
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, gender_Apprentice: value })
        }
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
      {/* Tipo de Dirección */}
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, address_Type_Apprentice: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Tipo de Dirección" />
        </SelectTrigger>
        <SelectContent>
          {addressTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        name="address_Apprentice"
        placeholder="Cr4 #10-15"
        onChange={handleChange}
        required
      />

      {/* Tipo de Aprendiz */}
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, tip_Apprentice: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Tipo de Aprendiz" />
        </SelectTrigger>
        <SelectContent>
          {tips.map((tip) => (
            <SelectItem key={tip} value={tip}>
              {tip}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Departamentos */}
      <Select onValueChange={handleDepartmentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Departamento" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem
              key={dept.id_department}
              value={dept.id_department.toString()}
            >
              {dept.name_department}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Municipios */}
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData,Id_municipality : parseInt(value) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Municipio" />
        </SelectTrigger>
        <SelectContent>
          {municipalities.length === 0 && (
            <p className="text-gray-500">No hay municipios disponibles.</p>
          )}
          {municipalities.map((municipality) => (
            <SelectItem
              key={municipality.id_municipality}
              value={municipality.id_municipality.toString()}
            >
              {municipality.municipality}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Fichas */}
      <Select
        onValueChange={(value) =>
          setFormData({ ...formData, file_id: parseInt(value) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Ficha" />
        </SelectTrigger>
        <SelectContent>
          {files.map((file) => (
            <SelectItem key={file.file_Id} value={file.file_Id.toString()}>
              {file.file_Id}-{file.programName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label>Correo acudiente</Label>
      <Input
        name="email_responsible"
        placeholder="Correo acudiente"
        type="email"
        onChange={handleChange}
        required
      />
       <Input
        name="doc_apprentice"
        placeholder="documento"
        onChange={handleChange}
        required
      />
      <Input
        name="nom_responsible"
        placeholder="nombre del acudiente"
        onChange={handleChange}
        required
      />
      <Input
        name="ape_responsible"
        placeholder="apellidos del acudiente"
        onChange={handleChange}
        required
      />
       <Input
        name="tel_responsible"
        placeholder="telefono del acudiente"
        onChange={handleChange}
        required
      />
      
      <Button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Registrando..." : "Registrar"}
      </Button>
    </form>
  );
}
