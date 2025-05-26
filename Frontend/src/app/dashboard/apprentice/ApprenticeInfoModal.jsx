"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fieldTranslations = {
  doc_apprentice: "Documento",
  first_Name_Apprentice: "Nombre",
  last_Name_Apprentice: "Apellido",
  address_Type_Apprentice: "Tipo de Dirección",
  address_Apprentice: "Dirección",
  email_Apprentice: "Correo",
  birth_Date_Apprentice_Formatted: "Fecha de Nacimiento",
  phone_Apprentice: "Teléfono",
  gender_Apprentice: "Género",
  tip_Apprentice: "Tipo",
  nom_responsible: "Nombre Responsable",
  ape_responsible: "Apellido Responsable",
  email_responsible: "Correo Responsable",
  tel_responsible: "Teléfono Responsable",
  municipalityName: "Municipio",
  departmentName: "Departamento",
  file_Id: "Ficha",
  programName: "Programa",
  areaName: "Área",
  status_Apprentice: "Estado",
  stratum_Apprentice: "Estrato",
};

export default function ModalInfoApprentice({ isOpen, onClose, apprenticeId }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["apprentice", apprenticeId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/Apprentice/GetApprenticeByIdAdmi/${apprenticeId}`);
      return res.data;
    },
    enabled: !!apprenticeId && isOpen, // Solo consulta si hay ID y el modal está abierto
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-4">
            Información del Aprendiz
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center text-gray-500">Cargando aprendiz...</p>
        ) : !data ? (
          <p className="text-center text-red-500">
            No se pudo cargar la información del aprendiz.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(data)
              .filter(
                ([key]) => !["id_Apprentice", "id_municipality"].includes(key)
              )
              .map(([key, value]) => (
                <div key={key} className="bg-gray-100 rounded-xl p-3 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">
                    {fieldTranslations[key] || key}
                  </p>
                  <p className="text-base text-gray-800">{value?.toString()}</p>
                </div>
              ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
