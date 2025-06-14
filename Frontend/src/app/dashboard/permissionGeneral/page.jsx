"use client";

import { useQuery } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterPermission from "./RegisterPermission";
import LoadingPage from "@/components/utils/LoadingPage";
import UpdatePermission from "./UpdatePermission";
import UpdateApprentice from "../apprentice/UpdateApprentice";

// Si luego tienes formularios de registro o edición
// // import RegisterPermission from "./RegisterPermission";
// import UpdatePermission from "./UpdatePermission";

export default function PermissionDashboard() {
  const {
    data: dataPermissions,
    isLoading,
    error,
  } = useQuery({
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
  console.log(dataPermissions);

  if (isLoading) return <LoadingPage />;
  const translations = {
    nombreAprendiz: "Aprendiz",
    fechalsalida: "Fecha Inicio",
    fechallegada: "Fecha Fin",
    motive: "Motivo",
    id_Apprentice: "Documento Aprendiz",
    status: "Estado",
    fechadesolicitud: "Fecha Solicitud",
  };
  if (error) {
    return (
      <div className="p-4 text-red-500">
         Error al cargar los permisos: {error.message}
      </div>
    );
  }
  const fieldLabels = ["Fecha", "Aprendiz", "Fecha Salida", "Fecha Llegada", "Estado"];
  const tableCell = ["fechadesolicitud", "nombreAprendiz", "fechalsalida", "fechallegada", "porcentaje"]
  return (
    <PrivateNav titlespage="Permisos">
      <ContecPage
        registerComponets={RegisterPermission} // Puedes poner null si no lo tienes
        titlesPage="Permisos"
        titlesData={fieldLabels}
        Data={dataPermissions}
        idKey="permissionId"
        // Puedes poner null si no lo tienes
        tableCell={tableCell}
        translations={translations}
        //ignorar campos que no se reflejen
        ignorar={["permissionId"]}
        // currentStatus="status"
        // fieldName="status"
        // inf del aprendiz
        inf={"id_Apprentice"}
        // updateComponets={UpdatePermission}
      />
    </PrivateNav>
  );
}
