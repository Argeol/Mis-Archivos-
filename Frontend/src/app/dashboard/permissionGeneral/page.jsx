"use client";

import { useQuery } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterPermission from "./RegisterPermission";
import LoadingPage from "@/components/utils/LoadingPage";

// Si luego tienes formularios de registro o edición
// // import RegisterPermission from "./RegisterPermission";
// import UpdatePermission from "./UpdatePermission";

export default function PermissionDashboard() {
  const {
    data: dataPermissions,isLoading,error} = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/permission/GetPermiso");
      if (res.status !== 200) throw new Error("Error al cargar permisos");
      return res.data;
    },
  });
//   const { data: dataApprentice, isLoading, error } = useQuery({
//     queryKey: ["aprendices"], // Nombre del caché
//     queryFn: async () => {
//       const response = await axiosInstance.get("api/Apprentice/GetApprentices");
//       if (!response.status === 200) throw new Error("Error al cargar los datos");
//       return response.data;
//     },
//   });
    console.log(dataPermissions)

  if (isLoading) return <LoadingPage />;
  const translations = {
    id_permission: "ID",
    NombreAprendiz: "Aprendiz",
    startDate: "Fecha Inicio",
    endDate: "Fecha Fin",
    reason: "Motivo",
    type: "Tipo",
    status: "Estado",
  };

  const fieldLabels = ["Fecha","Aprendiz", "Fecha Inicio", "Fecha Entrada", "Estado"];
  const tableCell = ["fechadesolicitud","nombreAprendiz", "fechalsalida", "fechallegada", "estado"];

  return (
    <PrivateNav>
      <ContecPage
        registerComponets={RegisterPermission}        // Puedes poner null si no lo tienes
        titlesPage="Permiso"
        titlesData={fieldLabels}
        Data={dataPermissions}
        idKey="id_permission"
            // Puedes poner null si no lo tienes
        tableCell={tableCell}
        translations={translations}
        ignorar={["id_permission"]}
        currentStatus="status"
        fieldName="status"
        inf={"id_Apprentice"}
        
      />
    </PrivateNav>
  );
}
