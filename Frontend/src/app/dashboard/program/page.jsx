"use client";

import { useQuery } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterProgram from "./registerComponet";
import UpdateProgram from "./UpdateComponet";

export default function ProgramDashboard() {
  // 🔹 Obtener lista de programas
  const { data: dataProgram, isLoading, error } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/Program/GetProgram");
      if (response.status !== 200) throw new Error("Error al cargar los programas");

      return Array.isArray(response.data)
        ? response.data.map((program) => ({
            program_Id: String(program.program_Id),
            program_Name: String(program.program_Name),
            area_Name: String(program.area_Name || "Sin Área"),
            state: String(program.state),
          }))
        : [];
    },
  });

  // 🔍 Traducciones de campos para mostrar en tabla
  const translations = {
    program_Id: "Número Ficha",
    program_Name: "Nombre Programa",
    area_Name: "Nombre Área",
  };

  // 🧱 Estructura de columnas visibles
  const fieldLabels = ["Id programa", "Programa", "Área", "Acciones"];
  const TableCell = ["program_Id", "program_Name", "area_Name"];

  if (isLoading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">Error al cargar programas</p>;

  return (
    <PrivateNav>
      <ContecPage
        registerComponets={RegisterProgram}
        titlesPage="Programas"
        titlesData={fieldLabels}
        Data={dataProgram}
        idKey="program_Id"
        updateComponets={UpdateProgram}
        tableCell={TableCell}
        translations={translations}
        ignorar={["state"]} // Oculta el campo estado de la tabla
        currentStatus="state"
        fieldName="state"
        updateEndpoint="/api/Program/UpdateProgram"
        queryKey="programs"
      />
    </PrivateNav>
  );
}
