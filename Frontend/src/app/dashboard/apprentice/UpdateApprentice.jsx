"use client";

import { useEffect, useState } from "react";
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

const genders = ["masculino", "femenino", "otro"];
const addressTypes = ["Barrio", "Vereda", "Corregimiento", "Comuna"];
const tips = ["interno", "externo"];

export default function UpdateApprentice({ id }) {
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axiosInstance.get(`/api/Apprentice/${id}`)
      .then((res) => setFormData(res.data));
    axiosInstance.get("/api/Department").then((res) => setDepartments(res.data));
    axiosInstance.get("/Api/File/Getfiles").then((res) => setFiles(res.data));
  }, [id]);

  const handleDepartmentChange = async (departmentId) => {
    try {
      const res = await axiosInstance.get(
        `/api/Municipality/byDepartment/${departmentId}`
      );
      setMunicipalities(res.data);
    } catch (error) {
      console.error("Error al cargar municipios:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/api/Apprentice/UpdateApprentice?id=${id}`,
        formData
      );
      alert(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error desconocido.";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Input
        name="first_Name_Apprentice"
        value={formData.first_Name_Apprentice || ""}
        placeholder="Nombre"
        onChange={handleChange}
        required
      />
      <Input
        name="last_Name_Apprentice"
        value={formData.last_Name_Apprentice || ""}
        placeholder="Apellido"
        onChange={handleChange}
        required
      />
      <Input
        name="birth_Date_Apprentice"
        type="date"
        value={formData.birth_Date_Apprentice?.split('T')[0] || ""}
        onChange={handleChange}
        required
      />
      <Input
        name="email_Apprentice"
        value={formData.email_Apprentice || ""}
        placeholder="Correo"
        type="email"
        onChange={handleChange}
        required
      />
      <Input
        name="phone_Apprentice"
        value={formData.phone_Apprentice || ""}
        placeholder="Teléfono"
        onChange={handleChange}
        required
      />

      {/* Género */}
      <Select
        value={formData.gender_Apprentice || ""}
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
        value={formData.address_Type_Apprentice || ""}
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

      {/* Tipo de Aprendiz */}
      <Select
        value={formData.tip_Apprentice || ""}
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

      <Button type="submit">Actualizar</Button>
    </form>
  );
}
