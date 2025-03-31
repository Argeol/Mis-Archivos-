"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterApprentice from "./registerApprentice";
import UpdateApprentice from "./UpdateApprentice";

export default function ApprenticeDashboard() {
  const [dataApprentice, setDataApprentice] = useState([]); // Lista de aprendices

  // Obtener aprendices desde el backend
  useEffect(() => {
    const fetchDataApprentice = async () => {
      try {
        const response = await axiosInstance.get(
          "api/Apprentice/GetApprentices"
        );
        console.log("Datos recibidos:", response.data);
        if (response.status !== 200) {
          throw new Error("Error al cargar los aprendices");
        }
        setDataApprentice(response.data);
      } catch (error) {
        console.error("Error fetching apprentices:", error);
      }
    };

    fetchDataApprentice();
  }, []);

  const translations = {
    id_Apprentice: "ID del Aprendiz",
    first_Name_Apprentice: "Nombre",
    last_Name_Apprentice: "Apellido",
    address_Type_Apprentice: "Tipo de Dirección",
    email_Apprentice: "Correo Electrónico",
    birth_Date_Apprentice_Formatted: "Fecha de Nacimiento",
    phone_Apprentice: "Teléfono",
    gender_Apprentice: "Género",
    tip_Apprentice: "Tipo de Aprendiz",
    municipality: "Municipio",
    name_department: "Departamento",
    file_Id: "ID de Ficha",
    program_Name: "Programa",
    area_Name: "Área",
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
          titlesPage={"aprenidz"}
          titlesData={fieldLabels}
          Data={dataApprentice}
          idKey="id_Apprentice"
          deleteUrl="/api/Apprentice/DeleteApprentice"
          setData={setDataApprentice}
          updateComponets={UpdateApprentice}
          campo1="first_Name_Apprentice"
          tableCell={TableCell}
          translations={translations}
        />
      </PrivateNav>
    </>
  );
}