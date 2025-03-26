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
// const statuses = ["Active", "Inactive"];
const addressTypes = ["Barrio", "Vereda", "Corregimiento", "Comuna"];
const tips = ["interno", "externo"];
export default function RegisterApprentice() {
  const [formData, setFormData] = useState({
    first_Name_Apprentice: "",
    last_Name_Apprentice: "",
    birth_Date_Apprentice: "",
    gender_Apprentice: "",
    email_Apprentice: "",
    address_Apprentice: "",
    address_Type_Apprentice: "",
    phone_Apprentice: "",
    status_Apprentice: "active",
    permission_Count_Apprentice: 0,
    tip_Apprentice: "",
    file_id: 0,
    municipality_Id: 0,
  });

  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/Department")
      .then((res) => setDepartments(res.data));
    axiosInstance.get("/Api/File/Getfiles").then((res) => setFiles(res.data));
  }, []);

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

    const newValue =
      name === "birth_Date_Apprentice" ? new Date(value).toISOString() : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const response = await axiosInstance.post("/api/Apprentice/CreateApprentice", formData);
        alert(response.data.message);
      } catch (error) {
        if (error.response) {
          // Mostrar el mensaje personalizado del backend
          const errorMessage = error.response.data.message || "Error desconocido.";
          alert(errorMessage);
        } else {
          alert("Error inesperado, por favor intenta nuevamente.");
        }
      }
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

      {/* Estado */}
      {/* <Select
        onValueChange={(value) =>
          setFormData({ ...formData, status_Apprentice: value })
        }
      > */}
        {/* <SelectTrigger>
          <SelectValue placeholder="Seleccionar Estado" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

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
      <Select onValueChange={(value) => handleDepartmentChange(value)}>
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
          setFormData({ ...formData, municipality_Id: parseInt(value) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Municipio" />
        </SelectTrigger>
        <SelectContent>
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
              {file.file_Id}-{file.program_Name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit">Registrar</Button>
    </form>
  );
}
