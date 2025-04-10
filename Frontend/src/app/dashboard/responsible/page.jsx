"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance"; // Componente de registro de responsable
// import UpdateResponsible from "./UpdateResponsible";
import RegisterResponsible from "./registerResposible"; // Componente de actualización de responsable
import LoadingPage from "@/components/utils/LoadingPage";

export default function ResponsibleDashboard() {
  const queryClient = useQueryClient();

  // 🔹 Obtener lista de responsables
  const { data: dataResponsible, isLoading, error } = useQuery({
    queryKey: ["responsables"], // Nombre del caché
    queryFn: async () => {
      const response = await axiosInstance.get("api/Responsible/GetResponsibles");
      if (!response.status === 200) throw new Error("Error al cargar los datos");
      return response.data;
    },
  });

  // 🔹 Mutación para eliminar un responsable
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/api/Responsible/DeleteResponsible/${id}`);
    },
    onSuccess: () => {
      // 🔥 Actualiza la caché después de eliminar
      queryClient.invalidateQueries(["responsables"]);
    },
  });

    if (isLoading) return <LoadingPage />;

  const translations = {
    nom_Responsible: "Nombre",
    ape_Responsible: "Apellido",
    tel_Responsible: "Teléfono",
    name_role: "Rol",
    state: "Estado",
  };

  const fieldLabels = ["Nombre", "Apellido"];
  const TableCell = [
    "nom_Responsible",
    "ape_Responsible",
    // "tel_Responsible",
    // "roleId",
    // "state",
  ];

  return (
    <PrivateNav>
      <ContecPage
        registerComponets={RegisterResponsible}
        titlesPage={"Responsable"}
        titlesData={fieldLabels}
        Data={dataResponsible}
        idKey="responsible_Id"
        deleteUrl="/api/Responsible/DeleteResponsible"
        deleteFunction={(id) => deleteMutation.mutate(id)}
        // updateComponets={UpdateResponsible}
        tableCell={TableCell}
        translations={translations}
        ignorar={["Responsible_Id"]}
      />
    </PrivateNav>
  );
}
