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
import { Value } from "@radix-ui/react-select";
import { Files } from "lucide-react";

const genders = ["Masculino", "Femenino", "Otro"];
const addressTypes = ["Barrio", "Vereda", "Corregimiento", "Comuna"];
const apprenticeTypes = ["Interno", "Externo"];
const statusOptions = ["Active", "Inactive"];

export default function UpdateApprentice({ id }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    first_name_apprentice: "",
    last_name_apprentice: "",
    birth_date_apprentice: new Date().toISOString(),
    gender_apprentice: "",
    email_apprentice: "",
    address_apprentice: "",
    address_type_apprentice: "",
    phone_Apprentice: "",
    status_Apprentice: "Active",
    tip_Apprentice: "",
    nom_responsible: "",
    ape_responsible: "",
    tel_responsible: "",
    email_responsible: "",
    id_municipality: 0,
    stratum_Apprentice: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["apprentice", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/Apprentice/GetApprenticeByIdAdmi/${id}`);
      return res.data || {};
    },
    enabled: !!id,
  });
  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        first_name_apprentice: data.first_Name_Apprentice || "",
        last_name_apprentice: data.last_Name_Apprentice || "",
        birth_date_apprentice: data.birth_Date_Apprentice_Formatted
          ? new Date(data.birth_Date_Apprentice_Formatted).toISOString()
          : new Date().toISOString(),
        gender_apprentice: data.gender_Apprentice || "",
        email_apprentice: data.email_Apprentice || "",
        address_apprentice: data.address_Apprentice || "",
        address_type_apprentice: data.address_Type_Apprentice || "",
        phone_Apprentice: data.phone_Apprentice || "",
        status_Apprentice: data.status_Apprentice || "Active",
        tip_Apprentice: data.tip_Apprentice || "",
        nom_responsible: data.nom_responsible || "",
        ape_responsible: data.ape_responsible || "",
        tel_responsible: data.tel_responsible || "",
        email_responsible: data.email_responsible || "",
        id_municipality: data.Id_municipality || 0, // Ajusta según el ID real
        stratum_Apprentice: data.stratum_apprentice || "",
      }));
    }
  }, [data]);

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Department");
      return res.data;
    },
  });

  const { data: files = [] } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const res = await axiosInstance.get("/Api/File/GetFiles");
      return res.data;
    },
  })

  const [id_department, setDepartmentId] = useState(null);

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
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 ">
      <Label>Nombre</Label>
      <Input
        name="first_name_apprentice"
        value={formData.first_name_apprentice}
        onChange={handleChange}
        required
      />
      <Label>Apellido</Label>
      <Input
        name="last_name_apprentice"
        value={formData.last_name_apprentice}
        onChange={handleChange}
        required
      />

      <Label>Email</Label>
      <Input
        name="email_apprentice"
        value={formData.email_apprentice}
        onChange={handleChange}
        required
      />

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
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, gender_apprentice: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={data.gender_Apprentice} />
        </SelectTrigger>
        <SelectContent>
          {genders.map((gender) => (
            <SelectItem key={gender} value={gender}>
              {gender}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Dirección</Label>
      <Input
        name="address_apprentice"
        value={formData.address_apprentice}
        onChange={handleChange}
      />

      <Label>Tipo de Dirección</Label>
      <Select
        value={formData.address_type_apprentice}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, address_type_apprentice: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={data.address_Type_Apprentice} />
        </SelectTrigger>
        <SelectContent>
          {addressTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Teléfono</Label>
      <Input
        name="phone_Apprentice"
        value={formData.phone_Apprentice}
        onChange={handleChange}
      />

      <Label>Estrato</Label>
      <Input
        placeholder={data.stratum_Apprentice}
        name="stratum_apprentice"
        value={formData.stratum_Apprentice || data.stratum_Apprentice}
        onChange={handleChange}
      />

      <Label>Tipo de Aprendiz</Label>
      <Select
        value={formData.tip_Apprentice}
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, tip_Apprentice: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={data.tip_Apprentice} />
        </SelectTrigger>
        <SelectContent>
          {apprenticeTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Nombre Responsable</Label>
      <Input
        name="nom_responsible"
        value={formData.nom_responsible}
        onChange={handleChange}
      />

      <Label>Apellido Responsable</Label>
      <Input
        name="ape_responsible"
        value={formData.ape_responsible}
        onChange={handleChange}
      />

      <Label>Teléfono Responsable</Label>
      <Input
        name="tel_responsible"
        value={formData.tel_responsible}
        onChange={handleChange}
      />

      <Label>Email Responsable</Label>
      <Input
        name="email_responsible"
        value={formData.email_responsible}
        onChange={handleChange}
      />

      <Label>Departamento</Label>
      <Select
        value={id_department?.toString() || ""}
        onValueChange={(value) => {
          setDepartmentId(parseInt(value));
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={data.departmentName} />
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

      <Label>Municipio</Label>
      <Select
        value={formData.id_municipality?.toString() || ""}
        onValueChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            id_municipality: parseInt(value), 
          }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={data.municipalityName || "Selecciona un municipio"} />
        </SelectTrigger>
        <SelectContent>
          {municipalities.map((mun) => (
            <SelectItem
              key={municipalities.id_municipality}
              value={municipalities.id_municipality.toString()} 
            >
              {municipalities.municipality}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label>Ficha</Label>
      <Select
        value={formData.file_Id?.toString() || ""}
        onValueChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            file_Id: parseInt(value),
          }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder={data.file_Id || "Selecciona una ficha"} />
        </SelectTrigger>
        <SelectContent>
          {files.map((file) => (
            <SelectItem key={file.file_Id} value={file.file_Id.toString()}>
              {file.file_Id} - {file.programName}
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
