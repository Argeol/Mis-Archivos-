import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";

const DeleteButton = ({ id, deleteUrl, idField, queryKey }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            console.log(`Intentando eliminar ID: ${id}, URL: ${deleteUrl}?id=${id}`);
            await axiosInstance.delete(`${deleteUrl}?id=${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries([queryKey]); // Actualizar lista automáticamente
            alert("Elemento eliminado con éxito.");
        },
        onError: (error) => {
            console.error("Error al eliminar:", error);
            alert("Error al intentar eliminar el elemento.");
        },
    });

    return (
        <Button onClick={() => mutation.mutate()} variant="destructive">
            {mutation.isLoading ? "Eliminando..." : "Eliminar"}
        </Button>
    );
};

export default DeleteButton;
