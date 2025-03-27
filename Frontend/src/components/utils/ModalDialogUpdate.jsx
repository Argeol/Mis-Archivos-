"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UpdateProgram from "@/app/dashboard/program/UpdateComponent";

function UpdateModal({ TitlePage, selectedData, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedData) {
      setIsOpen(true);
    }
  }, [selectedData]); // Se abrirá el modal cuando haya datos seleccionados

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* 🔹 Ahora actualiza correctamente */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar {TitlePage}</DialogTitle>
          </DialogHeader>
          {selectedData ? (
            <UpdateProgram program={selectedData} onClose={handleClose} onUpdate={onUpdate} />
          ) : (
            <p className="text-gray-500 text-center">Seleccione un programa para actualizar</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UpdateModal;
