import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ApprovalStatusModal } from "./ApprovalStatusModal";
import DeletePermissionButton from "./DeletePermission";

async function fetchMyPermissions() {
  const response = await axiosInstance.get(
    "/api/permission/GetPermissionsByApprentice",
    {
      withCredentials: true,
    }
  );
  return response.data;
}

function formatDateTime(date) {
  return format(new Date(date), "dd-MM-yyyy hh:mm a");
}

export default function ApprenticePermissionList() {
  const [open, setOpen] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchMyPermissions,
  });

  const handleViewStatus = (id) => {
    setSelectedPermissionId(id);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error al cargar los permisos.</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No has registrado permisos.</p>;
  }

  return (
    <div className="grid gap-4">
      {[...data]
        .sort(
          (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
        )
        .map((permiso) => (
          <Card key={permiso.permissionId}>
            <CardContent className="p-4 space-y-1">
              <p className="text-sm font-semibold text-gray-800">
                Estado:{" "}
                <span
                  className={`${
                    permiso.status === "Aprobado"
                      ? "text-green-600"
                      : permiso.status === "Rechazado"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {permiso.status}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Fecha de salida: {formatDateTime(permiso.departureDate)}
              </p>
              <p className="text-sm text-gray-700">
                Fecha de entrada: {formatDateTime(permiso.entryDate)}
              </p>
              <p className="text-sm text-gray-700">
                Dirección: {permiso.adress}
              </p>
              <p className="text-sm text-gray-700">Motivo: {permiso.motive}</p>
              <p className="text-sm text-gray-700">
                Observación: {permiso.observation}
              </p>
              <p className="text-xs text-gray-500">
                Fecha de solicitud: {formatDateTime(permiso.applicationDate)}
              </p>

              <Button
                variant="outline"
                className="mt-2"
                onClick={() => handleViewStatus(permiso.permissionId)}
              >
                Ver estado de aprobación
              </Button>
              {permiso.status === "Pendiente" && (
                <div className="">
                    <DeletePermissionButton idPermiso={permiso.permissionId} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

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
