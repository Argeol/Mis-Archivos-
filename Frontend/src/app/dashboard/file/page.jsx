"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterFile from "./registerComponet";
import UpdateFile from "./UpdateComponet";

export default function FileDashboard() {
  const [dataFile, setDataFile] = useState([]); 
  useEffect(() => {
    const fetchDataFile = async () => {
      try {
        const response = await axiosInstance.get("api/File/Getfiles");
        console.log("Datos recibidos:", response.data);
        if (response.status !== 200) {
          throw new Error("Error al cargar los archivos");
        }
        // Filtrar las fichas expiradas para que no puedan ser seleccionadas
        const filteredData = response.data.map(file => ({
          ...file,
          isDisabled: file.status === "Expirado" // Agregamos un flag para controlar la selección
        }));
        setDataFile(filteredData);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
  
    fetchDataFile();
  }, []);
  

  const translations = {
    file_Id: "ID de Ficha",
    apprentice_count: "Cantidad de Aprendices",
    end_Date: "Fecha de Finalización",
    start_Date: "Fecha de Inicio",
    programName: "Nombre del Programa",
    area_Name: "Área",
    status:"Estado de Ficha"
  };
  
  const fieldLabels = ["ID de Ficha", "Nombre del Programa", "Cantidad de Aprendices"];
  const TableCell = ["file_Id", "programName",  "apprentice_count"];

  return (
    <>
      <PrivateNav>
        <ContecPage
          registerComponets={RegisterFile}
          titlesPage={"Archivos"}
          titlesData={fieldLabels}
          Data={dataFile}
          idKey="file_Id"
          deleteUrl="/api/File/DeleteFile"
          setData={setDataFile}
          updateComponets={UpdateFile}
          campo1="program_Name"
          tableCell={TableCell}
          translations={translations}
          isDisabled={(row) => row.status === "Expirado"}
        />
      </PrivateNav>
    </>
  );
}