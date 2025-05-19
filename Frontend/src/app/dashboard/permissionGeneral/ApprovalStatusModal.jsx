import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axiosInstance";

function getStatusBadge(status) {
  switch (status) {
    case 0:
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-500">
          Pendiente
        </Badge>
      );
    case 1:
      return (
        <Badge variant="outline" className="text-green-600 border-green-500">
          Aprobado
        </Badge>
      );
    case 2:
      return (
        <Badge variant="outline" className="text-red-600 border-red-500">
          Rechazado
        </Badge>
      );
    default:
      return <Badge variant="outline">Desconocido</Badge>;
  }
}

export function ApprovalStatusModal({ permisoId, open, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (open && permisoId) {
      axiosInstance
        .get(`/api/PermissionApproval/estado?idPermiso=${permisoId}`)
        .then((res) => setData(res.data))
        .catch((err) =>
          console.error("Error cargando estado del permiso:", err)
        );
    }
  }, [permisoId, open]);

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Estado del Permiso:{" "}
            <span
              className={
                data.estadoPermiso === "Aprobado"
                  ? "text-green-600"
                  : data.estadoPermiso === "Rechazado"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {data.estadoPermiso}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <p>
            <strong>Aprendiz:</strong> {data.aprendiz.aprendiz}
          </p>
          <p>
            <strong>Tipo:</strong> {data.aprendiz.tip_Apprentice}
          </p>
        </div>

        <div className="space-y-2">
          {data.aprobaciones.map((aprobacion, i) => (
            <div key={i} className="border p-2 rounded-md">
              <p>
                <strong>Responsable:</strong> {aprobacion.nombre}
              </p>
              <p>
                <strong>Rol:</strong> {aprobacion.name_role}
              </p>
              <div>
                <strong>Estado:</strong>{" "}
                {getStatusBadge(aprobacion.approvalStatus)}
              </div>
              {aprobacion.approvalDate && (
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(aprobacion.approvalDate).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
