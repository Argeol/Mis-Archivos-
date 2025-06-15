"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdatePermission({ id }) {
  const queryClient = useQueryClient();
  const [departureDate, setDepartureDate] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [motive, setMotive] = useState("");
  const [observation, setObservation] = useState("");
  // const [status, setStatus] = useState("");

  // ✅ Obtener lista de estados de permisos
  // const permissionStatuses = ["Pendiente", "Aprobado", "Rechazado"];

  // ✅ Obtener datos del permiso seleccionado
  const { data: permissionData, isLoading: isLoadingPermission } = useQuery({
    queryKey: ["permission", id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `api/permission/GetPermisoById/${id}`
      );
      return response.data;
    },
    enabled: !!id, // Solo ejecutar si hay un ID válido
  });

  // ✅ Actualizar el estado cuando `permissionData` cambie
  useEffect(() => {
    if (permissionData) {
      // console.log("✅ Actualizando estado con datos:", permissionData);
      setDepartureDate(permissionData.departureDate || "");
      setEntryDate(permissionData.entryDate || "");
      setMotive(permissionData.motive || "");
      setObservation(permissionData.observation || "");
      // setStatus(permissionData.status || "");
      // console.log("🔄 Estado actualizado:", permissionData);
    }
  }, [permissionData]);

  // ✅ Mutación para actualizar el permiso
  const updatePermissionMutation = useMutation({
    mutationFn: async (newData) => {
      const res = await axiosInstance.put(
        `api/permission/UpdatePermission/${id}`,
        newData
      );
      // console.log("📤 Respuesta de actualización:", res.data);
      return res.data; // Esto será lo que llega al onSuccess
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["permissions"]);
      alert(data.message); // ✅ Aquí sí puedes usar "data"
    },
    onError: () => {
      alert("❌ Error al actualizar el permiso.");
    },
  });

  // ✅ Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("📤 Enviando datos:", {
    //   departureDate,
    //   entryDate,
    //   motive,
    //   observation,
    //   // status,
    // });
    updatePermissionMutation.mutate({
      departureDate,
      entryDate,
      motive,
      observation,
      // status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-4">
      {isLoadingPermission ? (
        <p className="text-center text-blue-500">Cargando datos...</p>
      ) : (
        <>
          <Input
            name="departureDate"
            value={departureDate}
            placeholder="Fecha de salida"
            type="datetime-local"
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
          <Input
            name="entryDate"
            value={entryDate}
            placeholder="Fecha de entrada"
            type="datetime-local"
            onChange={(e) => setEntryDate(e.target.value)}
            required
          />
          <Input
            name="motive"
            value={motive}
            placeholder="Motivo"
            onChange={(e) => setMotive(e.target.value)}
            required
          />
          <Input
            name="observation"
            value={observation}
            placeholder="Observación"
            onChange={(e) => setObservation(e.target.value)}
            required
          />
          {/* <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar Estado" />
            </SelectTrigger>
            <SelectContent>
              {permissionStatuses.map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <Button
        type="submit"
        disabled={mutation.isLoading}
        className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 rounded-md mx-auto block w-full flex items-center justify-center gap-2"
      >
        {mutation.isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Actualizando...
          </>
        ) : (
          <>Actualizar</>
        )}
      </Button>
        </>
      )}
    </form>
  );
}
