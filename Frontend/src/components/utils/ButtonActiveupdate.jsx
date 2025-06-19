import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

export default function StatusToggleButton({
  id,
  currentStatus,
  fieldName,         // ← nombre del campo que se actualizará
  updateEndpoint,    // ← ruta base del endpoint
  queryKey,          // ← clave para invalidar la query
  onSuccess,
}) {
  // console.log(currentStatus)
  const [status, setStatus] = useState(currentStatus === "Activo");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (statusString) => {
      const formData = { [fieldName]: statusString };
      const response = await axiosInstance.put(`${updateEndpoint}/${id}`, formData);
      return response.data.message;
    },
    onSuccess: (data, statusString) => {
      const newStatus = statusString === "Activo";
      setStatus(newStatus);
      toast.success("Estado actualizado correctamente");
      queryClient.invalidateQueries([queryKey, id]); // ← dinámico
      if (onSuccess) onSuccess(statusString);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error al actualizar");
    },
  });

  const toggleStatus = () => {
    const newStatus = !status;
    const statusString = newStatus ? "Activo" : "Inactivo";

    const confirmChange = window.confirm(
      `¿Estás seguro de que deseas cambiar el estado a "${statusString}"?`
    );
    if (!confirmChange) return;

    mutation.mutate(statusString);
  };

  return (
    <Button
      variant={status ? "default" : "outline"}
      className={
        status
          ? "bg-green-500 hover:bg-green-600"
          : "bg-red-500 hover:bg-red-600 text-white"
      }
      onClick={toggleStatus}
      disabled={mutation.isPending}
    >
      {status ? "Activo" : "Inactivo"}
    </Button>
  );
}
