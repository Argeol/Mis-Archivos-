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

export default function AuthorizePermissionModal({
  isOpen,
  onClose,
  responsibleId,
}) {
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);

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
      const response = await axiosInstance.post(
        `/api/PermissionApproval/aprobar?idPermiso=${selectedPermissionId}&idResponsable=${responsibleId}`
      );

      // Si la respuesta es exitosa, revisamos el mensaje
      if (response.status === 200) {
        alert(response.data.message); // Aquí muestras el mensaje recibido del servidor
      } 
      // Si el permiso fue autorizado correctamente, cerrar el modal
      onClose();
    } catch (error) {
      alert("Ocurrió un error: " + error.message); // Aquí manejarás cualquier error inesperado
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Autorizar Permiso</DialogTitle>
        </DialogHeader>

        <Input value={responsibleId} readOnly className="mb-4" />
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
          <Button onClick={handleConfirm} disabled={!selectedPermissionId}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
