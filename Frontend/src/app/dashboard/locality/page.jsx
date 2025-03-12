
"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";

export default function LocalityDashboard() {
    const [dataLocality, setDataLocality] = useState([]); // Lista de localidades
    
    const fieldLabels = {
        locality_Id: "ID Localidad",
        locality_Name: "Nombre Localidad",
        locality_Type: "Tipo Localidad",
        department_Name: "Departamento"
    };

    // Obtener localidades desde el backend
    useEffect(() => {
        const fetchDataLocality = async () => {
            try {
                const response = await axiosInstance.get("api/Locality/AllLocality");
    
                if (response.status !== 200) {
                    throw new Error("Error al cargar las localidades");
                }

                console.log("Datos recibidos:", response.data); // 🔍 Depuración

                // Transformar datos para asegurar que solo haya valores en texto
                const formattedData = response.data.map((locality) => ({
                    locality_Id: String(locality.locality_Id), 
                    locality_Name: String(locality.locality_Name), 
                    locality_Type: String(locality.locality_Type),
                    department_Name: locality.department ? String(locality.department.department_Name) : "Sin Departamento"
                }));

                console.log("Datos transformados:", formattedData); // 🔍 Depuración

                setDataLocality(formattedData);
            } catch (error) {
                console.error("Error fetching localities:", error);
            }
        };
    
        fetchDataLocality();
    }, []);
    

    return (
        <PrivateNav>
            <ContecPage
                titlesPage="Localidades"
                titlesData={["ID", "Nombre", "Tipo", "Departamento"]}
                idKey="locality_Id"
                Data={dataLocality}
                deleteUrl="api/Locality/DeleteLocality"
                setData={setDataLocality}
                updateUrl="api/Locality/UpdateLocality"
                createUrl="api/Locality/CreateLocality"
                initialData={{ locality_Id: "", locality_Name: "", locality_Type: "", department_Name: "" }}
                onRegister={(newData) =>
                    setDataLocality((prev) => [
                        ...prev,
                        {
                            locality_Id: String(newData.locality_Id),
                            locality_Name: String(newData.locality_Name),
                            locality_Type: String(newData.locality_Type),
                            department_Name: newData.department ? String(newData.department.department_Name) : "Sin Departamento"
                        }
                    ])
                }
                fieldLabels={fieldLabels}
            />
        </PrivateNav>
    );
}
