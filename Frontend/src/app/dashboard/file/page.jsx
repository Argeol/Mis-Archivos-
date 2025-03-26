"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import RegisterFile from "./registerComponet";
import UpdateFile from "./UpdateComponet";

export default function Dashboard() {
    const [dataFile, setDataFile] = useState([]); // Lista de archivos
    
    const fieldLabels = {
        file_Id: "ID Archivo",
        apprentice_count: "Cantidad de Aprendices",
        start_Date: "Fecha Inicio",
        end_Date: "Fecha Fin",
        program_Name: "Nombre Programa",
        area_Name: "Área"
    };

    // Obtener archivos desde el backend
    useEffect(() => {
        const fetchDataFile = async () => {
            try {
                const response = await axiosInstance.get("/Api/File/GetFiles");
    
                if (response.status !== 200) {
                    throw new Error("Error al cargar los archivos");
                }

                console.log("Datos recibidos:", response.data); // 🔍 Depuración

                // Transformar datos para asegurar que solo haya valores en texto
                const formattedData = response.data.map((file) => ({
                    file_Id: String(file.file_Id), 
                    apprentice_count: String(file.apprentice_count), 
                    start_Date: String(file.start_Date), 
                    end_Date: String(file.end_Date),
                    program_Name: String(file.program_Name  || "Sin Programa"),
                    area_Name: String(file.area_Name)|| "Sin Área"
                }));

                
                console.log("Datos transformados:", formattedData); // 🔍 Depuración

                setDataFile(formattedData);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };
    
        fetchDataFile();
    }, []);
    

    return (
        <PrivateNav>
            <ContecPage
                registerComponets={RegisterFile}
                updateComponet={UpdateFile}
                titlesPage="Ficha"
                titlesData={["ID", "Cantidad de Aprendices", "Fecha Inicio", "Fecha Fin", "Programa", "Área"]}
                idKey="file_Id"
                Data={dataFile}
                deleteUrl="api/File/DeleteFile"
                setData={setDataFile}
                updateUrl="api/File/UpdateFile"
                createUrl="api/File/CreateFile"
                initialData={{ file_Id: "", apprentice_count: "", start_Date: "", end_Date: "", program_Name: "", area_Name: "" }}
                onRegister={(newData) =>
                    setDataFile((prev) => [
                        ...prev,
                        {
                            file_Id: String(newData.file_Id),
                            apprentice_count: String(newData.apprentice_count),
                            start_Date: String(newData.start_Date),
                            end_Date: String(newData.end_Date),
                            program_Name: newData.program ? String(newData.program.program_Name) : "Sin Programa",
                            area_Name: newData.program && newData.program.area ? String(newData.program.area.area_Name) : "Sin Área"
                        }
                    ])
                }
                fieldLabels={fieldLabels}
            />
        </PrivateNav>
    );
}
