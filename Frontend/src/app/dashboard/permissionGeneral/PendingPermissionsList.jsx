"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ModalInfoApprentice from "../apprentice/ApprenticeInfoModal";
import { useState } from "react";
import { ApprovalStatusModal } from "./ApprovalStatusModal";

async function fetchPendingPermissions() {
  const response = await axiosInstance.get("/api/permission/GetPendingPermissionsForResponsible", {
    withCredentials: true,
  });
  return response.data;
}

function formatDateTime(fecha) {
  const date = new Date(fecha);
  return format(date, "hh:mm a dd-MM-yyyy");
}

export function PendingPermissionsList() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [isOpenApprenticeModal, setIsOpenApprenticeModal] = useState(false);
  const [selectedApprenticeId, setSelectedApprenticeId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pending-permissions"],
    queryFn: fetchPendingPermissions,
  });

  const aprobarPermiso = useMutation({
    mutationFn: async (idPermiso) => {
      const res = await axiosInstance.put(`/api/PermissionApproval/aprobar?idPermiso=${idPermiso}`);
      return res.data.message;
    },
    onSuccess: (message) => {
     toast.success(message, {
        duration: 5000, // duración en milisegundos
      });
      queryClient.invalidateQueries(["pending-permissions"]);
    },
    onError: (error) => {
      toast.error("Error al aprobar el permiso: " + error.message);
    },
  });

  const rechazarPermiso = useMutation({
    mutationFn: async (idPermiso) => {
      const res = await axiosInstance.put(`/api/PermissionApproval/rechazar?idPermiso=${idPermiso}`);
      return res.data.message;
    },
    onSuccess: (message) => {
      toast.success(message, {
        duration: 5000, // duración en milisegundos
      });
      queryClient.invalidateQueries(["pending-permissions"]);
    },
    onError: (error) => {
      toast.error("Error al rechazar el permiso: " + error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error al cargar los permisos.</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No hay permisos pendientes.</p>;
  }

  return (
    <div className="grid gap-4">
      {data.map((permiso) => (
        <Card key={permiso.permissionId}>
          <CardContent className="p-4 space-y-1">
            <p className="text-sm font-medium">
              Aprendiz: {permiso.first_Name_Apprentice} {permiso.last_Name_Apprentice}
            </p>
            <p className="text-xs text-gray-600">
              Fecha de salida: {formatDateTime(permiso.departureDate)}
            </p>
            <p className="text-xs text-gray-600">
              Fecha de entrada: {formatDateTime(permiso.entryDate)}
            </p>
            <p className="text-xs text-gray-600">Dirección: {permiso.adress}</p>
            <p className="text-xs text-gray-600">Destino: {permiso.destination}</p>
            <p className="text-xs text-gray-600">Motivo: {permiso.motive}</p>
            <p className="text-xs text-gray-600">Observación: {permiso.observation}</p>
            <p className="text-xs text-gray-600">Tipo de aprendiz: {permiso.tip_Apprentice}</p>
            <p className="text-xs text-gray-600">Ficha: {permiso.file_Id}</p>
            <p className="text-xs text-gray-600">
              Responsable: {permiso.nom_responsible} {permiso.ape_responsible}
            </p>
            <p className="text-xs text-gray-600">
              Teléfono del responsable: {permiso.tel_responsible}
            </p>

            <div className="space-x-2 mt-2">
              <Button
                size="sm"
                onClick={() => aprobarPermiso.mutate(permiso.permissionId)}
                disabled={aprobarPermiso.isLoading}
              >
                Aceptar
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => rechazarPermiso.mutate(permiso.permissionId)}
                disabled={rechazarPermiso.isLoading}
              >
                Rechazar
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedApprenticeId(permiso.id_aprendiz || null);
                  setIsOpenApprenticeModal(true);
                }}
              >
                Inf Completa Aprendiz
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => {
                  setSelectedPermissionId(permiso.permissionId);
                  setOpen(true);
                }}
              >
                Ver estado de aprobación
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <ModalInfoApprentice
        isOpen={isOpenApprenticeModal}
        onClose={() => {
          setIsOpenApprenticeModal(false);
          setSelectedApprenticeId(null);
        }}
        apprenticeId={selectedApprenticeId}
      />

      {selectedPermissionId && (
        <ApprovalStatusModal
          permisoId={selectedPermissionId}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
