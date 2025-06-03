"use client";

import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterProgram from "./registerComponet";
import UpdateProgram from "./UpdateComponet";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingPage from "@/components/utils/LoadingPage";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // 🔹 Obtener programas con React Query
  const {
    data: dataProgram = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/Program/GetProgram");

      console.log("Datos recibidos:", response.data); // 🔍 Depuración

      return Array.isArray(response.data)
        ? response.data.map((program) => ({
            program_Id: String(program.program_Id),
            program_Name: String(program.program_Name),
            area_Name: String(program.area_Name || "Sin Área"),
            state: String(program.state), // Agregamos el estado
          }))
        : [];
    },
  });

  // ✅ Mutación para cambiar el estado del programa
  const changeStateMutation = useMutation({
    mutationFn: async ({ id, currentState }) => {
      const newState = currentState === "Activo" ? "Inactivo" : "Activo";
      await axiosInstance.put(`/api/Program/ChangeState/${id}`, {
        state: newState,
      });
      return newState;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["programs"]);
      alert("Estado cambiado con éxito.");
    },
    onError: () => {
      alert("Error al cambiar el estado.");
    },
  });

  // ✅ Función para manejar el cambio de estado
  const handleChangeState = (id, currentState) => {
    changeStateMutation.mutate({ id, currentState });
  };
  if (isLoading) return <LoadingPage />;

  const translations = {
    program_Id: "Número Ficha",
    program_Name: "Nombre Programa",
    area_Name: "Nombre Área",
    state: "Estado",
  };

  const fieldLabels = ["Id programa", "Programa", "Área"];
  const TableCell = ["program_Id", "program_Name", "area_Name"];

  return (
    <PrivateNav titlespage="Programas">
      {isLoading ? (
        <LoadingPage />
      ) : error ? (
        <p className="text-red-500 text-center">⚠️ Error al cargar programas</p>
      ) : (
        <ContecPage
          registerComponets={RegisterProgram}
          titlesPage="Programas"
          titlesData={fieldLabels}
          Data={dataProgram}
          idKey="program_Id"
          updateComponets={UpdateProgram}
          tableCell={TableCell}
          translations={translations}
          currentStatus={"state"}
          fieldName={"state"}
          updateEndpoint={"/api/Program/UpdateProgram"}
          queryKey={"programs"}
          // customActions={(row) => (
          //   <Button
          //     onClick={() => handleChangeState(row.program_Id, row.state)}
          //     className={`text-white px-3 py-1 rounded-md ${
          //       row.state === "Activo" ? "bg-red-500" : "bg-green-500"
          //     }`}
          //   >
          //     {row.state === "Activo" ? "Desactivar" : "Activar"}
          //   </Button>
          // )}
        />
      )}
    </PrivateNav>
  );
}
