import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CreateModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, document });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Registrar Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document" className="text-right">Documento</Label>
              <Input id="document" value={document} onChange={(e) => setDocument(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Registrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateModal;
