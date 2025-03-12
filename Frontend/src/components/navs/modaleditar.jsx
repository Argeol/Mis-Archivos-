import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function UpdateModal({ isOpen, onClose, user, onUpdate }) {
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setDocumento(user.documento);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      onUpdate({ ...user, nombre, documento });
    }
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input id="name" value={nombre} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Documento
              </Label>
              <Input id="email" value={documento} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateModal;
