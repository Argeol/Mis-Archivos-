"use client";

import { useQuery } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import LoadingPage from "@/components/utils/LoadingPage";
import RegisterPermissionFS from "./RegisterPermissionFS";
import ExportExcelButton from "./ButtonExelFS";

export default function PermissionFSDashboard() {
  const { data: dataPermissionFS, isLoading } = useQuery({
    queryKey: ["permissionFS"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/PermissionFS");
      if (res.status !== 200) throw new Error("Error al cargar permisos FS");
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;

  const fieldLabels = [
    "Destino", "Fecha Diligenciado", "Fecha Salida", "Fecha Entrada", 
    "Día Salida", "Alojamiento", "SENA/Empresa", "Dirección", "Aprendiz"
  ];

  const tableCell = [
    "destino", "fec_Diligenciado", "fec_Salida", "fec_Entrada", 
    "dia_Salida", "alojamiento", "sen_Empresa", "direccion", "apprentice.nombre"
  ];

  const translations = {
    destino: "Destino",
    fec_Diligenciado: "Fecha Diligenciado",
    fec_Salida: "Fecha Salida",
    fec_Entrada: "Fecha Entrada",
    dia_Salida: "Día de salida",
    alojamiento: "Alojamiento",
    sen_Empresa: "¿SENA o empresa?",
    direccion: "Dirección",
    "apprentice.nombre": "Nombre del aprendiz"
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/api/PermissionFS/export", {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "PermisosFS.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  return (
    <PrivateNav titlespage="Permisos Fin de Semana">
      <ContecPage
        registerComponets={RegisterPermissionFS}
        titlesPage="Permisos FS"
        titlesData={fieldLabels}
        Data={dataPermissionFS}
        idKey="permissionFS_Id"
        tableCell={tableCell}
        translations={translations}
        ignorar={["permissionFS_Id"]}
        inf="apprentice.Aprenttice_Id"
        botonExtra={<ExportExcelButton/>}
      />
    </PrivateNav>
  );
}
