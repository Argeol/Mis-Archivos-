"use client";

import { useEffect, useState } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import ContecPage from "@/components/utils/ContectPage";
import axiosInstance from "@/lib/axiosInstance";
import UpdateModal from "@/components/modals/UpdateModal"; // Asegurar importación correcta

export default function Dashboard() {
    const [dataProgram, setDataProgram] = useState([]); // Lista de programas
    const [selectedProgram, setSelectedProgram] = useState(null); // Programa seleccionado para editar
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal

    const fieldLabels = {
        program_Id: "Número Ficha",
        program_Name: "Nombre Programa",
        area_Id: "ID Área" // Cambiado de "Nombre Área" a "ID Área"
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

                // Transformar la lista asegurando `area_Id`
                const formattedData = programsList.map((program) => ({
                    program_Id: String(program.program_Id), 
                    program_Name: String(program.program_Name), 
                    area_Id: String(program.area_Id || ""), // Guardamos el ID del área
                }));

                console.log("Datos transformados:", formattedData); // 🔍 Depuración

                setDataProgram(formattedData);
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };
    
        fetchDataProgram();
    }, []);

    // Manejo de actualización de programas
    const handleUpdate = async (updatedProgram) => {
        try {
            const response = await axiosInstance.put(`/api/Program/UpdateProgram/${updatedProgram.program_Id}`, {
                program_Id: updatedProgram.program_Id,
                program_Name: updatedProgram.program_Name,
                area_Id: updatedProgram.area_Id, // Enviar ID del área, no nombre
            });

            if (response.status !== 200) {
                throw new Error("Error al actualizar el programa");
            }

            // Actualizar la lista local sin recargar la página
            setDataProgram((prev) =>
                prev.map((program) =>
                    program.program_Id === updatedProgram.program_Id ? updatedProgram : program
                )
            );

            setIsModalOpen(false);
        } catch (error) {
            console.error("Error actualizando el programa:", error);
        }
    };

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
                initialData={{ program_Id: "", program_Name: "", area_Id: "" }}
                onRegister={(newData) =>
                    setDataProgram((prev) => [
                        ...prev,
                        {
                            program_Id: String(newData.program_Id),
                            program_Name: String(newData.program_Name),
                            area_Id: String(newData.area_Id || ""), // Usar ID del área
                        }
                    ])
                }
                fieldLabels={fieldLabels}
                onEdit={(program) => {
                    setSelectedProgram(program);
                    setIsModalOpen(true);
                }}
            />

            {/* Modal de edición */}
            <UpdateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={selectedProgram} 
                onUpdate={handleUpdate} 
            />
        </PrivateNav>
    );
}
