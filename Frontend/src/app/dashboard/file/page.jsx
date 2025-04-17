"use client";

import { useQuery } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterFile from "./registerComponet";
import LoadingPage from "@/components/utils/LoadingPage"; // ya debe estar importado
import UpdateFile from "./UpdateComponet";

export default function FileDashboard() {
  // 🔹 Obtener lista de fichas con React Query
  const { data: dataFile = [], isLoading, error } = useQuery({
    queryKey: ["fichas"],
    queryFn: async () => {
      const response = await axiosInstance.get("Api/File/GetFiles");
      if (!response.status === 200) throw new Error("Error al cargar los datos");
      return response.data;
    },
  });

  // 🔹 Mostrar loading mientras se cargan los datos
  if (isLoading) return <LoadingPage />;


  const translations = {
    file_Id: "Numero de Ficha",
    apprentice_count: "Cantidad de Aprendices",
    end_Date: "Fecha de Finalización",
    start_Date: "Fecha de Inicio",
    programName: "Nombre del Programa",
    area_Name: "Área",
    status: "Estado de Ficha",
  };

  const fieldLabels = ["Numero de Ficha", "Nombre del Programa", "Cantidad de Aprendices"];
  const TableCell = ["file_Id", "programName", "apprentice_count"];

  return (
    <PrivateNav>
      <ContecPage
        registerComponets={RegisterFile}
        titlesPage={"Ficha"}
        titlesData={fieldLabels}
        Data={dataFile}
        idKey="file_Id"
        tableCell={TableCell}
        translations={translations}
        isDisabled={(row) => row.status === "Expirado"}
        updateComponets={UpdateFile}
      />
    </PrivateNav>
  );
}
