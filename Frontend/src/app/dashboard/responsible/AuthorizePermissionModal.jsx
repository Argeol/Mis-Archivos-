"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthorizePermissionModal({
  isOpen,
  onClose,
  responsibleId,
  responsibleName,
}) {
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [confirmar, setconfirmar] = useState();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["pendingPermissions", isOpen],
    queryFn: async () => {
      const res = await axiosInstance.get("api/permission/GetPermiso");
      return res.data;
    },
    enabled: isOpen,
  });

  const handleConfirm = async () => {
    try {
      let response;

      if (confirmar === 1) {
        // Si confirmar es 1, se aprueba el permiso
        response = await axiosInstance.post(
          `/api/PermissionApproval/aprobar?idPermiso=${selectedPermissionId}&idResponsable=${responsibleId}`
        );
      } else if (confirmar === 0) {
        // Si confirmar es 0, se rechaza el permiso
        response = await axiosInstance.post(
          `/api/PermissionApproval/rechazar?idPermiso=${selectedPermissionId}&idResponsable=${responsibleId}`
        );
      }

      // Si la respuesta es exitosa, mostramos el mensaje del servidor
      if (response.status === 200) {
        alert(response.data.message);
      }

      // Cerrar el modal después de la acción
      onClose();
    } catch (error) {
      alert("Ocurrió un error: " + error.message); // Manejo de errores
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Autorizar Permiso</DialogTitle>
        </DialogHeader>
        <Label htmlFor="responsibleName">
          Nombre del Responsable Autorizar
        </Label>
        <Input value={responsibleName} readOnly className="mb-4" />
        <Label htmlFor="permission">Seleccionar Permiso</Label>
        <Select
          onValueChange={(value) => setSelectedPermissionId(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar Permiso" />
          </SelectTrigger>
          <SelectContent>
            {permissions.map((permission) => (
              <SelectItem
                key={permission.permissionId}
                value={permission.permissionId.toString()}
              >
                {`${permission.permissionId} - ${permission.nombreAprendiz}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              setconfirmar(0); // Rechazar
              handleConfirm();
            }}
            disabled={!selectedPermissionId}
          >
            Rechazar
          </Button>
            <hr></hr>
          <Button
            onClick={() => {
              setconfirmar(1); // Confirmar
              handleConfirm();
            }}
            disabled={!selectedPermissionId}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
