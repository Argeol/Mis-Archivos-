import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Roles definidos
const roles = [
  { id: 1, label: "Instructor" },
  { id: 2, label: "Coordinador" },
  { id: 3, label: "Bienestar" },
  { id: 4, label: "Internado" },
];

export default function RegisterPermission() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    departureDate: "",
    entryDate: "",
    adress: "",
    destination: "",
    motive: "",
    observation: "",
    status: 0,
    responsibleIds: {
      instructorId: null,
      coordinatorId: null,
      bienestarId: null,
      internadoId: null,
    },
  });
  const [currentStep, setCurrentStep] = useState(0); // Paso actual

  // Query para obtener los responsables según el rol
  const { data: responsables = [] } = useQuery({
    queryKey: ["responsables", roles[currentStep]?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/Responsible/GetResponsiblesByRole/roleid=${roles[currentStep].id}`
      );
      console.log("Responsables:", res.data); // Depuración de la respuesta de la API
      return res.data;
    },
    enabled: currentStep < roles.length, // Solo cuando el paso es válido
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        ...formData.responsibleIds,
      };
      const res = await axiosInstance.post("/api/permission/CrearPermiso/", payload);
      return res.data;
    },
    onSuccess: () => {
      alert("Permiso registrado exitosamente");
      queryClient.invalidateQueries(["permissions"]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error al registrar el permiso.";
      alert(errorMessage);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResponsibleSelect = (value) => {
    const roleKey = [
      "instructorId",
      "coordinatorId",
      "bienestarId",
      "internadoId",
    ][currentStep];

    setFormData((prev) => ({
      ...prev,
      responsibleIds: {
        ...prev.responsibleIds,
        [roleKey]: parseInt(value),
      },
    }));

    // Avanza al siguiente paso solo si el usuario selecciona un responsable
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(); // Llama a la mutación para registrar el permiso
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-2 bg-white space-y-4">
      {/* Campos del permiso */}
      <div className="space-y-1 px-2">
        <Label htmlFor="departureDate">Fecha de salida</Label>
        <Input
          id="departureDate"
          type="datetime-local"
          name="departureDate"
          onChange={handleChange}
          required
        />
      </div>

      {/* Otros campos como entrada, dirección, etc. */}
      {/* ... */}

      {/* Selección de responsables según el rol actual */}
      {currentStep < roles.length && (
        <div className="space-y-2 px-2">
          <Label>Seleccionar {roles[currentStep].label}</Label>
          <Select onValueChange={handleResponsibleSelect}>
            <SelectTrigger>
              <SelectValue
                placeholder={`Seleccione un ${roles[currentStep].label}`}
              />
            </SelectTrigger>
            <SelectContent>
              {responsables?.map((respo) => (
                <SelectItem key={respo.responsible_Id} value={respo.responsible_Id.toString()}>
                  {respo.nom_Responsible} {respo.ape_Responsible}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Botón de enviar solo cuando se hayan seleccionado todos los responsables */}
      {currentStep >= roles.length && (
        <div className="px-2">
          <Button
            type="submit"
            className="w-full py-2 mt-2"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Registrando..." : "Registrar Permiso"}
          </Button>
        </div>
      )}
    </form>
  );
}
