"use client";

import { useQuery } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterAdmin from "./registerAdmi"; // Asegúrate que exista
import UpdateAdmin from "./updateAdmi";     // Asegúrate que exista
import LoadingPage from "@/components/utils/LoadingPage";

export default function AdminDashboard() {
  const { data: adminData = [], isLoading, error } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/User/GetAdmins");
      if (res.status !== 200) throw new Error("Error al cargar administradores");
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  // Solo mostramos correo y tipo de usuario
  const fieldLabels = ["Correo", "Tipo de Usuario"];
  const tableCell = ["email", "userType"]; // Deben coincidir con los nombres de las propiedades en adminData

  const translations = {
    email: "Correo",
    userType: "Tipo de Usuario",
  };

  return (
    <PrivateNav titlespage="Administradores">
      <ContecPage
        registerComponets={RegisterAdmin}       // Verifica nombre prop
        titlesPage="Administradores"
        titlesData={fieldLabels}
        Data={adminData}
        idKey="user_Id"                         // Ajusta si el ID en tu data tiene otro nombre
        tableCell={tableCell}
        translations={translations}
        updateComponets={UpdateAdmin}
        ignorar={["Status_User"]}                // Ignora campos que no quieras mostrar (si existen)
        currentStatus="Status_User"
        updateEndpoint="/api/User/UpdateAdmi/{id}/"  // Ajusta si es necesario
        queryKey="admins"
      />
    </PrivateNav>
  );
}
