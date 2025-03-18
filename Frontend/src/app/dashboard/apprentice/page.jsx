"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";

export default function ApprenticeDashboard() {
    const [dataApprentice, setDataApprentice] = useState([]); // Lista de aprendices

    // Obtener aprendices desde el backend
    useEffect(() => {
        const fetchDataApprentice = async () => {
            try {
                const response = await axiosInstance.get("api/Apprentice/GetApprentices");
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

    const fieldLabels = {
        id_Apprentice: "ID del Aprendiz",
        first_Name_Apprentice: "Nombre",
        last_Name_Apprentice: "Apellido",
        address_Type_Apprentice: "Tipo de Dirección",
        email_Apprentice: "Correo Electrónico",
        birth_Date_Apprentice: "Fecha de Nacimiento",
        phone_Apprentice: "Teléfono",
        gender_Apprentice: "Género",
        tip_Apprentice: "Tipo Aprendiz",
        attendant_Name: "Acudiente",
        attendant_Phone: "Teléfono del Acudiente",
        municipality: "Municipio",
        name_department: "Departamento",
        program_Name: "Programa",
        area_Name: "Área",
    };

    return (
        <>
            <PrivateNav>
                <ContecPage
                    titlesPage="Aprendices"
                    titlesData={[
                        "ID", "Nombre", "Apellido", "Tipo Dirección", "Correo", 
                        "Fecha Nacimiento", "Teléfono", "Género", "Tipo Aprendiz", 
                        "Acudiente", "Tel. Acudiente", "Municipio", "Departamento", 
                        "Programa", "Área"
                    ]}
                    idKey="id_Apprentice"
                    Data={dataApprentice}
                    deleteUrl="api/Apprentice/DeleteApprentice"
                    setData={setDataApprentice}
                    updateUrl="/api/Apprentice/"
                    createUrl="api/Apprentice/CreateApprentice"
                    initialData={{
                        id_Apprentice: "",
                        first_Name_Apprentice: "",
                        last_Name_Apprentice: "",
                        address_Type_Apprentice: "",
                        email_Apprentice: "",
                        birth_Date_Apprentice: "",
                        phone_Apprentice: "",
                        gender_Apprentice: "",
                        tip_Apprentice: "",
                        attendant_Name: "",
                        attendant_Phone: "",
                        municipality: "",
                        name_department: "",
                        program_Name: "",
                        area_Name: ""
                    }}
                    onRegister={(newData) => setDataApprentice((prev) => [...prev, newData])}
                    fieldLabels={fieldLabels}
                />
            </PrivateNav>
        </>
    );
}
