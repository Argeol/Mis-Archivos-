import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance"; // Ajusta la ruta según tu proyecto

export default function DeletePermissionButton({ idPermiso}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/api/permission/EliminarPermisoPorAprendiz?idPermiso=${idPermiso}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["permissions"]); // Ajusta la query key según corresponda
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error desconocido.";
      toast.error(message);
    },
  });

  const handleDelete = () => {
    if (!confirm("¿Está seguro de eliminar este permiso? Esta acción no se puede deshacer.")) return;
    mutation.mutate();
  };

  return (
    <button onClick={handleDelete} disabled={mutation.isLoading}>
      {mutation.isLoading ? "Eliminando..." : "Eliminar Permiso"}
    </button>
  );
}
