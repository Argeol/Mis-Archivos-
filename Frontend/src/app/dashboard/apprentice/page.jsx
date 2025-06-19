"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterApprentice from "./registerApprentice";
import UpdateApprentice from "./UpdateApprentice";
import LoadingPage from "@/components/utils/LoadingPage";

export default function ApprenticeDashboard() {
  const queryClient = useQueryClient();

  // 🔹 Obtener lista de aprendices
  const { data: dataApprentice, isLoading, error } = useQuery({
    queryKey: ["aprendices"], // Nombre del caché
    queryFn: async () => {
      const response = await axiosInstance.get("/api/Apprentice/all");

      if (!response.status === 200) throw new Error(response?.data?.message);
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

  if (isLoading) return <LoadingPage />;
  if (error) return <p>Error: {error.message}</p>;

  const translations = {
    id_Apprentice: "Documento",
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
    stratum_Apprentice: "Estrato",
    tip_document: "Tipo de Codumento",
  };

  const fieldLabels = ["Documento", "Nombre", "Apellido", "Teléfono", "Ficha"];
  const TableCell = [
    "id_Apprentice",
    "first_Name_Apprentice",
    "last_Name_Apprentice",
    "phone_Apprentice",
    "file_Id",
  ];

  return (
    <>
      <PrivateNav titlespage="Aprendices">
        <ContecPage
          registerComponets={RegisterApprentice}
          //como se llama la tabla
          titlesPage={"Aprendices"}
          //como se llaman los camppos de la datatable
          titlesData={fieldLabels}
          //la data que se va a mostrar del metodo get
          Data={dataApprentice}
          //id de la tabla
          idKey="id_Apprentice"
          // deleteFunction={(id) => deleteMutation.mutate(id)}
          // Para el update del componente
          updateComponets={UpdateApprentice}
          //lo que vas a mostrar en la tabla y el trslations es el la lista de como se van a llamar los campos visualmente
          tableCell={TableCell}
          translations={translations}
          //ignorar los campos que no se van a mostrar en la tabla
          ignorar={["status_Apprentice"]}
          //update del estado  -->
          currentStatus={"status_Apprentice"}
          updateEndpoint="/api/Apprentice/UpdateApprentice"
          queryKey="aprendices"
        />
      </PrivateNav>
    </>
  );
}

