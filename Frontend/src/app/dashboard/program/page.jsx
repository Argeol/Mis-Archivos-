"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterProgram from "./registerComponet";
import UpdateProgram from "./UpdateComponent"; // 🔹 Importar el nuevo componente

export default function Dashboard() {
    const [dataProgram, setDataProgram] = useState([]); // Lista de programas
    
    const fieldLabels = {
        program_Id: "Número Ficha",
        program_Name: "Nombre Programa",
        area_Name: "Nombre Área" // Asegurar que coincide con la API
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

    return (
        <PrivateNav>
            <ContecPage
                registerComponets={RegisterProgram}
                updateComponets={UpdateProgram} // 🔹 Agregar el componente de actualización
                titlesPage="programas"
                titlesData={["ID", "Nombre", "Área"]}
                idKey="program_Id"
                Data={dataProgram}
                deleteUrl="api/Program/DeleteProgram"
                setData={setDataProgram}
                updateUrl="api/Program/UpdateProgram"
                createUrl="api/Program/CreateProgram"
                initialData={{ program_Id: "", program_Name: "", area_Id: "" }}
                onRegister={(newData) =>
                    setDataProgram((prev) => [
                        ...prev,
                        {
                            program_Id: String(newData.program_Id),
                            program_Name: String(newData.program_Name),
                            area_Name: String(newData.area_Name || "Sin Área") // Coincide con API
                        }
                    ])
                }
                fieldLabels={fieldLabels}
            />
        </PrivateNav>
    );
}
