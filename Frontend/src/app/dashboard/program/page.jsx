"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";

export default function Dashboard() {
    const [dataProgram, setDataProgram] = useState([]); // Lista de programas
    
    const fieldLabels = {
        program_Id: "Número Ficha",
        program_Name: "Nombre Programa",
        Area_name: "Nombre Área"
    };

    // Obtener programas desde el backend
    useEffect(() => {
        const fetchDataProgram = async () => {
            try {
                const response = await axiosInstance.get("/api/Program/GetProgram");

                if (response.status !== 200) {
                    throw new Error("Error al cargar los programas");
                }

                console.log("Datos recibidos:", response.data); // 🔍 Depuración

                // Asegurar que siempre obtenemos un array
                const programsList = response.data?.$values || [];

                // Transformar la lista
                const formattedData = programsList.map((program) => ({
                    program_Id: String(program.program_Id), 
                    program_Name: String(program.program_Name), 
                    Area_name: String(program.area_Name || "Sin Área")
                }));

                console.log("Datos transformados:", formattedData); // 🔍 Depuración

                setDataProgram(formattedData);
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };
    
        fetchDataProgram();
    }, []);
    
    return (
        <PrivateNav>
            <ContecPage
                titlesPage="programas"
                titlesData={["ID", "Nombre", "Área"]}
                idKey="program_Id"
                Data={dataProgram}
                deleteUrl="api/Program/DeleteProgram"
                setData={setDataProgram}
                updateUrl="api/Program/UpdateProgram"
                createUrl="api/Program/CreateProgram"
                initialData={{ program_Id: "", program_Name: "", Area_name: "" }}
                onRegister={(newData) => {
                    setDataProgram((prev) => {
                        // Buscar si el programa ya existe en la lista
                        const existingIndex = prev.findIndex(p => p.program_Id === String(newData.program_Id));

                        if (existingIndex !== -1) {
                            // Si existe, actualizarlo
                            const updatedData = [...prev];
                            updatedData[existingIndex] = {
                                program_Id: String(newData.program_Id),
                                program_Name: String(newData.program_Name),
                                Area_name: String(newData.area_Name || "Sin Área")
                            };
                            return updatedData;
                        } else {
                            // Si no existe, agregarlo
                            return [
                                ...prev,
                                {
                                    program_Id: String(newData.program_Id),
                                    program_Name: String(newData.program_Name),
                                    Area_name: String(newData.area_Name || "Sin Área")
                                }
                            ];
                        }
                    });
                }}
                fieldLabels={fieldLabels}
            />
        </PrivateNav>
    );
}
