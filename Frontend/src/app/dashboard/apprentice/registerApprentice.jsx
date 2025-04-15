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
    status_Apprentice: "Activo",
    permission_Count_Apprentice: 0,
    tip_Apprentice: "",
    file_id: 0,
    Id_municipality: 0,
    nom_responsible: "",
    ape_responsible: "",
    tel_responsible: "",
    email_responsible: "",
  });

  const [id_department, setDepartmentId] = useState(null);
  const [program_Id, setProgramId] = useState(null);

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/Department");
      return res.data;
    },
  });

  const { data: files = [] } = useQuery({
    queryKey: ["files", program_Id],
    queryFn: async () => {
      const res = await axiosInstance.get(`Api/File/GetMunicipalitiesByDepartment/${program_Id}`);
      return res.data;
    },
  });
const { data: program = [] } = useQuery({
    queryKey: ["program"],
    queryFn: async () => {
      const res = await axiosInstance.get("/Api/Program/GetProgram");
      return res.data;
    },
  });
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
      const res = await axiosInstance.post("/api/Apprentice", formData);
      return res.data;
      
    },
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries(["apprentices"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      alert(errorMessage);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleDepartmentChange = (value) => {
    const departmentId = parseInt(value);
    setDepartmentId(departmentId);
    setFormData((prev) => ({ ...prev, Id_municipality: 0 }));
  };

  const handleprogramChange = (value) => {
    const program_Id = parseInt(value);
    setProgramId(program_Id);
    setFormData((prev) => ({ ...prev, file_id: 0 }));
  };
    
  
    const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2  rounded-2xl bg-white space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Documento</Label>
          <Input
            name="id_Apprentice"
            placeholder="Documento"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Nombre</Label>
          <Input
            name="first_Name_Apprentice"
            placeholder="Nombre"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Apellido</Label>
          <Input
            name="last_Name_Apprentice"
            placeholder="Apellido"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Fecha de Nacimiento</Label>
          <Input
            name="birth_Date_Apprentice"
            type="date"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Correo</Label>
          <Input
            name="email_Apprentice"
            type="email"
            placeholder="Correo"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Teléfono</Label>
          <Input
            name="phone_Apprentice"
            placeholder="Teléfono"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Género</Label>
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
        </div>

        <div>
          <Label>Tipo de Dirección</Label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, address_Type_Apprentice: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de Dirección" />
            </SelectTrigger>
            <SelectContent>
              {addressTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label>Dirección</Label>
          <Input
            name="address_Apprentice"
            placeholder="Dirección (Cr4 #10-15)"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Tipo de Aprendiz</Label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, tip_Apprentice: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Interno / Externo" />
            </SelectTrigger>
            <SelectContent>
              {tips.map((tip) => (
                <SelectItem key={tip} value={tip}>
                  {tip}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Departamento</Label>
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
        </div>

        <div>
          <Label>Municipio</Label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, Id_municipality: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar Municipio" />
            </SelectTrigger>
            <SelectContent>
              {municipalities.length === 0 ? (
                <p className="text-gray-500 p-2">
                  No hay municipios disponibles
                </p>
              ) : (
                municipalities.map((municipality) => (
                  <SelectItem
                    key={municipality.id_municipality}
                    value={municipality.id_municipality.toString()}
                  >
                    {municipality.municipality}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Select
        onValueChange={(value) =>
          setFormData({ ...formData, program_Id: parseInt(value) })
        }
      >
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar Programa" />
      </SelectTrigger>
      <SelectContent>
        {program.map((Program) => (
          <SelectItem key={Program.program_Id} value={Program.program_Id.toString()}>
            {Program.program_Name}
          </SelectItem>
        ))}
      </SelectContent>
      </Select>


        <div>
          <Label>Ficha</Label>
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
                  {file.file_Id} - {file.programName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Correo del Acudiente</Label>
          <Input
            name="email_responsible"
            placeholder="Correo del Acudiente"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Nombre del Acudiente</Label>
          <Input
            name="nom_responsible"
            placeholder="Nombre del Acudiente"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Apellido del Acudiente</Label>
          <Input
            name="ape_responsible"
            placeholder="Apellido del Acudiente"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Teléfono del Acudiente</Label>
          <Input
            name="tel_responsible"
            placeholder="Teléfono del Acudiente"
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={mutation.isLoading} className="w-full">
          {mutation.isLoading ? "Registrando..." : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
