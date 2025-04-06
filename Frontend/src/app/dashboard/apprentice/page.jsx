"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterApprentice from "./registerApprentice";
import UpdateApprentice from "./UpdateApprentice";

export default function ApprenticeDashboard() {
  const queryClient = useQueryClient();

  // 🔹 Obtener lista de aprendices
  const { data: dataApprentice, isLoading, error } = useQuery({
    queryKey: ["aprendices"], // Nombre del caché
    queryFn: async () => {
      const response = await axiosInstance.get("api/Apprentice/GetApprentices");
      if (!response.status === 200) throw new Error("Error al cargar los datos");
      return response.data;
    },
  });

  // 🔹 Mutación para eliminar un aprendiz
  // const deleteMutation = useMutation({
  //   mutationFn: async (id) => {
  //     await axiosInstance.delete(`/api/Apprentice/DeleteApprentice/${id}`);
  //   },
  //   onSuccess: () => {
  //     // 🔥 Actualiza la caché después de eliminar
  //     queryClient.invalidateQueries(["aprendices"]);
  //   },
  // });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const translations = {
    doc_apprentice: "Documento de Aprendiz",
    first_Name_Apprentice: "Nombre",
    last_Name_Apprentice: "Apellido",
    address_Type_Apprentice: "Tipo de Dirección",
    address_Apprentice: "Dirección",
    email_Apprentice: "Correo Electrónico",
    birth_Date_Apprentice_Formatted: "Fecha de Nacimiento",
    phone_Apprentice: "Teléfono",
    gender_Apprentice: "Género",
    tip_Apprentice: "Tipo de Aprendiz",
    nom_responsible: "Nombre del Responsable",
    ape_responsible: "Apellido del Responsable",
    email_responsible: "Correo del Responsable",
    tel_responsible: "Teléfono del Responsable",
    municipalityName: "Municipio",
    departmentName: "Departamento",
    file_Id: "ID de Ficha",
    programName: "Programa",
    areaName: "Área",
  };
  
  const fieldLabels = ["Nombre", "Apellido", "Teléfono", "Ficha"];
  const TableCell = [
    "first_Name_Apprentice",
    "last_Name_Apprentice",
    "phone_Apprentice",
    "file_Id",
  ];

  return (
    <>
      <PrivateNav>
        <ContecPage
          registerComponets={RegisterApprentice}
          titlesPage={"Aprendiz"}
          titlesData={fieldLabels}
          Data={dataApprentice}
          idKey="id_Apprentice"
          deleteUrl="/api/Apprentice/DeleteApprentice"
          deleteFunction={(id) => deleteMutation.mutate(id)}
          updateComponets={UpdateApprentice}
          tableCell={TableCell}
          translations={translations}
          ignorar={["id_Apprentice","status_Apprentice"]}
          currentStatus={"status_Apprentice"}
          fieldName="status_Apprentice"
          updateEndpoint="/api/Apprentice/UpdateApprentice"
          queryKey="aprendices"
        />
      </PrivateNav>
    </>
  );
}

