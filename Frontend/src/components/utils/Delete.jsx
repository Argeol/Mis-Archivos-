import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";

const DeleteButton = ({ id, deleteUrl, setData, idField }) => {
    const handleDelete = async () => {
        if (!id || !setData || !deleteUrl || !idField) {
            console.error("Error: Parámetros faltantes en DeleteButton.");
            return;
        }

        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este registro?");
        if (!confirmDelete) return;

        try {
            const response = await axiosInstance.delete(`${deleteUrl}?id=${id}`);
            if (response.status === 200) {
                setData((prevData) => Array.isArray(prevData) ? prevData.filter((item) => item[idField] !== id) : []);
                alert("Registro eliminado exitosamente");
            } else {
                throw new Error(`Error al eliminar el registro: ${response.status}`);
            }
        } catch (error) {
            console.error("Error eliminando el registro:", error);
            alert("Hubo un problema al eliminar el registro.");
        }
    };

    return (
        <Button onClick={handleDelete} variant="destructive">
            Eliminar
        </Button>
    );
};

export default DeleteButton;
