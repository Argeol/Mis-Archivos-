"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterProgram from "./registerComponet";
import UpdateProgram from "./UpdateComponet"; // 🔹 Importar el nuevo componente

export default function Dashboard() {
    const [dataProgram, setDataProgram] = useState([]); // Lista de programas
 
    // Obtener programas desde el backend
    useEffect(() => {
        const fetchDataProgram = async () => {
            try {
                
                const response = await axiosInstance.get("/api/Program/GetProgram");

                if (response.status !== 200) {
                    throw new Error("Error al cargar los programas");
                }

                console.log("Datos recibidos:", response.data); // 🔍 Depuración

                // Verificar que `response.data` es un array
                const programsList = Array.isArray(response.data) ? response.data : [];

                // Transformar la lista
                const formattedData = programsList.map((program) => ({
                    program_Id: String(program.program_Id), 
                    program_Name: String(program.program_Name), 
                    area_Name: String(program.area_Name || "Sin Área") // Asegurar coincidencia con API
                }));

                console.log("Datos transformados:", formattedData); // 🔍 Depuración

                setDataProgram(formattedData);
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };
    
        fetchDataProgram();
    }, []);

    const translations = {
        program_Id: "Número Ficha",
        program_Name: "Nombre Programa",
        area_Name: "Nombre Área" 
    }
    const fieldLabels = ["Id programa", "Programa", "Area"];
    const TableCell = [
        "program_Id",
        "program_Name",
        "area_Name",
      ];

    return (
        <PrivateNav>
            <ContecPage
                registerComponets={RegisterProgram}
                titlesPage="Programas"
                titlesData={fieldLabels}
                Data={dataProgram}
                idKey="program_Id"
                deleteUrl="/api/Program/DeleteProgram"
                setData={setDataProgram}
                updateComponets={UpdateProgram}
                tableCell={TableCell}
                translations={translations}








              />
        </PrivateNav>
    );
}
