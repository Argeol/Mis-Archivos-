"use client";

import PrivateNav from "@/components/navs/PrivateNav";
import DataTable from "@/components/utils/Datatable";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";

export default function Dashboard({ children }) {
    const [dataDepartments, setDataDepartments] = useState([]);

    // Obtener departamentos desde el backend
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get("api/Department/AllDepartments");
                if (response.status !== 200) {
                    throw new Error("Error al cargar los Departamentos");
                }
                setDataDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    return (
        <>
            <PrivateNav>
                <DataTable
                    Data={dataDepartments} // Pasa los datos obtenidos al componente DataTable
                    titlesData={["ID", "Nombre", "Descripción"]} // Ejemplo de títulos para las columnas
                />
                {children}
            </PrivateNav>
        </>
    );
}
