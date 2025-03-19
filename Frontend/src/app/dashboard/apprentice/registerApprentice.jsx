import { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    status_Apprentice: "",
    permission_Count_Apprentice: 0,
    tip_Apprentice: "",
    attendant_Id: "",
    file_id: "",
    municipality_Id: ""
  });
  
  const [attendants, setAttendants] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axiosInstance.get("/attendants").then(res => setAttendants(res.data));
    axiosInstance.get("/municipalities").then(res => setMunicipalities(res.data));
    axiosInstance.get("/files").then(res => setFiles(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/apprentices", formData);
      alert("Aprendiz registrado con éxito");
    } catch (error) {
      console.error("Error al registrar aprendiz", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <Input name="first_Name_Apprentice" placeholder="Nombre" onChange={handleChange} required />
      <Input name="last_Name_Apprentice" placeholder="Apellido" onChange={handleChange} required />
      <Input name="birth_Date_Apprentice" type="date" onChange={handleChange} required />
      <Input name="email_Apprentice" placeholder="Correo" type="email" onChange={handleChange} required />
      <Input name="phone_Apprentice" placeholder="Teléfono" onChange={handleChange} required />
      
      <Select onValueChange={(value) => setFormData({ ...formData, attendant_Id: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Acudiente" />
        </SelectTrigger>
        <SelectContent>
          {attendants.map(attendant => (
            <SelectItem key={attendant.id} value={attendant.id}>{attendant.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select onValueChange={(value) => setFormData({ ...formData, municipality_Id: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Municipio" />
        </SelectTrigger>
        <SelectContent>
          {municipalities.map(municipality => (
            <SelectItem key={municipality.id} value={municipality.id}>{municipality.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select onValueChange={(value) => setFormData({ ...formData, file_id: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar Ficha" />
        </SelectTrigger>
        <SelectContent>
          {files.map(file => (
            <SelectItem key={file.id} value={file.id}>{file.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button type="submit">Registrar</Button>
    </form>
  );
}