"use client"; 
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance"; // Asegúrate de importar correctamente tu instancia de Axios
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterApprentice({ open, onClose }) {
  const [departments, setDepartments] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
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
    id_Municipality: "",
  });

  useEffect(() => {
    axiosInstance.get("/api/department")
      .then(response => setDepartments(response.data))
      .catch(error => console.error("Error fetching departments:", error));
  }, []);

  const handleDepartmentChange = async (departmentId) => {
    setFormData({ ...formData, id_Municipality: "" }); // Reiniciar municipio al cambiar departamento
    try {
      const response = await axiosInstance.get(`/api/municipality/byDepartment/${departmentId}`);
      setMunicipalities(response.data);
    } catch (error) {
      console.error("Error fetching municipalities:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/apprentice", formData);
      alert("Aprendiz registrado correctamente");
      onClose();
    } catch (error) {
      console.error("Error al registrar aprendiz:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Aprendiz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input
                type="text"
                value={formData.first_Name_Apprentice}
                onChange={(e) => setFormData({ ...formData, first_Name_Apprentice: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input
                type="text"
                value={formData.last_Name_Apprentice}
                onChange={(e) => setFormData({ ...formData, last_Name_Apprentice: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Fecha de nacimiento</Label>
            <Input
              type="date"
              value={formData.birth_Date_Apprentice}
              onChange={(e) => setFormData({ ...formData, birth_Date_Apprentice: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Género</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, gender_Apprentice: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Masculino</SelectItem>
                <SelectItem value="Female">Femenino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email_Apprentice}
              onChange={(e) => setFormData({ ...formData, email_Apprentice: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Teléfono</Label>
            <Input
              type="text"
              value={formData.phone_Apprentice}
              onChange={(e) => setFormData({ ...formData, phone_Apprentice: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Dirección</Label>
            <Input
              type="text"
              value={formData.address_Apprentice}
              onChange={(e) => setFormData({ ...formData, address_Apprentice: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Departamento</Label>
            <Select onValueChange={handleDepartmentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id_department} value={dept.id_department}>
                    {dept.name_department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Municipio</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, id_Municipality: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un municipio" />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((mun) => (
                  <SelectItem key={mun.id_municipality} value={mun.id_municipality}>
                    {mun.municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">Registrar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
