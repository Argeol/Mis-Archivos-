"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import RegisterAttendant from "./registerAttendant";  // Formulario para crear un acudiente
import UpdateAttendantForm from "./UpdateAttendantForm";  // Formulario para actualizar un acudiente
import axiosInstance from "@/lib/axiosInstance";

export default function AttendantDashboard() {
    const [dataAttendant, setDataAttendant] = useState([]); // Lista de acudientes

    // Obtener acudientes desde el backend
    useEffect(() => {
        const fetchDataAttendant = async () => {
            try {
                const response = await axiosInstance.get("api/Attendant/AllAttendants");
                if (response.status !== 200) {
                    throw new Error("Error al cargar los acudientes");
                }
                setDataAttendant(response.data);
            } catch (error) {
                console.error("Error fetching attendants:", error);
            }
        };

        fetchDataAttendant();
    }, []);

    const fieldLabels = {
        attendant_Id: "ID del Asistente",
        attendant_Name: "Nombre",
        attendant_Surname: "Apellido",
        attendant_Phone: "Teléfono",
        attendant_Address: "Dirección",
        attendant_Email: "Correo Electrónico",
        attendant_Age: "Edad",
        attendant_BirthDate: "Fecha de Nacimiento",
    };

    return (
        <>
            <PrivateNav>
                <ContecPage
                    titlesPage="Acudientes"
                    titlesData={["Id", "Nombre", "Apellido", "Telefono", "Direccion", "Gmail", "Edad",]}
                    idKey="attendant_Id"
                    Data={dataAttendant}
                    deleteUrl="api/Attendant/DeleteAttendant"
                    setData={setDataAttendant}
                    updateUrl="api/Attendant/UpdateAttendant"
                    createUrl="api/Attendant/CreateAttendant"
                    initialData={{ attendant_Id: "", attendant_Name: "", attendant_Surname: "", attendant_Phone: "", attendant_Address: "", attendant_Email: "", attendant_Age: "" }}
                    onRegister={(newData) => setDataAttendant((prev) => [...prev, newData])}
                    fieldLabels={fieldLabels}
                />
            </PrivateNav>
        </>
    );
}
