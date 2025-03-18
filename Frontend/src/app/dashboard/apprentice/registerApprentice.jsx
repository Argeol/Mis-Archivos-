import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";

export default function RegisterApprentice() {
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [attendants, setAttendants] = useState([]);
  const [areas, setAreas] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [formData, setFormData] = useState({
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
    tip_Apprentice: "Regular",
    attendant_Id: "",
    file_id: "",
    municipality_Id: "",
  });

  useEffect(() => {
    axiosInstance.get("/api/Department").then((res) => setDepartments(res.data));
    axiosInstance.get("/api/Attendant/AllAttendants").then((res) => setAttendants(res.data));
    axiosInstance.get("/api/Area/AllArea").then((res) => setAreas(res.data));
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      axiosInstance
        .get(`/api/Municipality/byDepartment/{departmentId}`)
        .then((res) => setMunicipalities(res.data));
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedArea) {
      axiosInstance.get(`/api/programs?areaId=${selectedArea}`).then((res) => setPrograms(res.data));
    }
  }, [selectedArea]);

  useEffect(() => {
    if (selectedProgram) {
      axiosInstance.get(`/Api/File/Id_Program?programId=${selectedProgram}`).then((res) => setFiles(res.data));
    }
  }, [selectedProgram]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/apprentices", formData);
      alert("Aprendiz registrado exitosamente");
    } catch (error) {
      alert("Error registrando aprendiz");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="first_Name_Apprentice" placeholder="Nombre" onChange={handleChange} required />
      <Input name="last_Name_Apprentice" placeholder="Apellido" onChange={handleChange} required />
      <Input name="birth_Date_Apprentice" type="date" onChange={handleChange} required />
      <Input name="email_Apprentice" placeholder="Email" type="email" onChange={handleChange} required />
      <Select onValueChange={setSelectedDepartment} placeholder="Seleccione un departamento">
        {departments.map((dep) => (
          <SelectItem key={dep.id} value={dep.id}>{dep.name}</SelectItem>
        ))}
      </Select>
      <Select name="municipality_Id" onValueChange={(val) => setFormData({ ...formData, municipality_Id: val })} placeholder="Seleccione un municipio">
        {municipalities.map((mun) => (
          <SelectItem key={mun.id} value={mun.id}>{mun.name}</SelectItem>
        ))}
      </Select>
      <Select onValueChange={setSelectedArea} placeholder="Seleccione un área">
        {areas.map((area) => (
          <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
        ))}
      </Select>
      <Select onValueChange={setSelectedProgram} placeholder="Seleccione un programa">
        {programs.map((prog) => (
          <SelectItem key={prog.id} value={prog.id}>{prog.name}</SelectItem>
        ))}
      </Select>
      <Select name="file_id" onValueChange={(val) => setFormData({ ...formData, file_id: val })} placeholder="Seleccione una ficha">
        {files.map((file) => (
          <SelectItem key={file.id} value={file.id}>{file.name}</SelectItem>
        ))}
      </Select>
      <Select name="attendant_Id" onValueChange={(val) => setFormData({ ...formData, attendant_Id: val })} placeholder="Seleccione un acudiente">
        {attendants.map((att) => (
          <SelectItem key={att.id} value={att.id}>{att.name}</SelectItem>
        ))}
      </Select>
      <Button type="submit">Registrar</Button>
    </form>
  );
}
