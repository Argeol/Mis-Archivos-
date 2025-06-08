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

  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pending-permissions"],
    queryFn: fetchPendingPermissions,
  });

  const aprobarPermiso = useMutation({
    mutationFn: async (idPermiso) => {
      setApprovingId(idPermiso);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axiosInstance.put(`/api/PermissionApproval/aprobar?idPermiso=${idPermiso}`);
      return res.data.message;
    },
    onSuccess: (message) => {
      toast.success(message, { duration: 5000 });
      queryClient.invalidateQueries(["pending-permissions"]);
    },
    onError: (error) => {
      toast.error("Error al aprobar el permiso: " + error.message);
    },
    onSettled: () => {
      setApprovingId(null);
    },
  });

  const rechazarPermiso = useMutation({
    mutationFn: async (idPermiso) => {
      setRejectingId(idPermiso);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await axiosInstance.put(`/api/PermissionApproval/rechazar?idPermiso=${idPermiso}`);
      return res.data.message;
    },
    onSuccess: (message) => {
      toast.success(message, { duration: 5000 });
      queryClient.invalidateQueries(["pending-permissions"]);
    },
    onError: (error) => {
      toast.error("Error al rechazar el permiso: " + error.message);
    },
    onSettled: () => {
      setRejectingId(null);
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
            <p className="text-xs text-gray-600">Fecha de salida: {formatDateTime(permiso.departureDate)}</p>
            <p className="text-xs text-gray-600">Fecha de entrada: {formatDateTime(permiso.entryDate)}</p>
            <p className="text-xs text-gray-600">Dirección: {permiso.adress}</p>
            <p className="text-xs text-gray-600">Destino: {permiso.destination}</p>
            <p className="text-xs text-gray-600">Motivo: {permiso.motive}</p>
            <p className="text-xs text-gray-600">Observación: {permiso.observation}</p>
            <p className="text-xs text-gray-600">Tipo de aprendiz: {permiso.tip_Apprentice}</p>
            <p className="text-xs text-gray-600">Ficha: {permiso.file_Id}</p>
            <p className="text-xs text-gray-600">Responsable: {permiso.nom_responsible} {permiso.ape_responsible}</p>
            <p className="text-xs text-gray-600">Teléfono del responsable: {permiso.tel_responsible}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {/* Botón Aceptar */}
              <Button
                type="button"
                disabled={approvingId === permiso.permissionId}
                className="hover:bg-blue-700 bg-blue-600"
                onClick={() => aprobarPermiso.mutate(permiso.permissionId)}
                size="sm"
              >
                {approvingId === permiso.permissionId ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Aceptando...</span>
                  </>
                ) : (
                  <>Aceptar</>
                )}
              </Button>

              {/* Botón Rechazar */}
              <Button
                type="button"
                disabled={rejectingId === permiso.permissionId}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-1 flex items-center gap-2"
                onClick={() => rechazarPermiso.mutate(permiso.permissionId)}
                size="sm"
              >
                {rejectingId === permiso.permissionId ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Rechazando...</span>
                  </>
                ) : (
                  <>Rechazar</>
                )}
              </Button>

              {/* Info aprendiz */}
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

              {/* Estado de aprobación */}
              <Button
                size="sm"
                variant="outline"
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
