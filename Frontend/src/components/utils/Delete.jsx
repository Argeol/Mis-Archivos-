import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";

const DeleteButton = ({ id, deleteUrl, setData, idField }) => {
    const handleDelete = async () => {
        try {
          console.log(`Intentando eliminar ID: ${id}, URL: ${deleteUrl}?id=${id}`);
          const response = await axiosInstance.delete(`${deleteUrl}?id=${id}`);
          setData((prev) => prev.filter((item) => item[idField] !== id));
          alert("Elemento eliminado con éxito.");
        } catch (error) {
          console.error("Error al eliminar:", error);
          alert("Error al intentar eliminar el elemento.");
        }
      };
      

  return (
    <Button onClick={handleDelete} variant="destructive">
      Eliminar
    </Button>
  );
};

export default DeleteButton;
