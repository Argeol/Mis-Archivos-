import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

function ModalDialogUpdate({ TitlePage, UpdateComponent, id }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleCloseForm = () => setIsOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Actualizar {TitlePage}</Button>
      <Dialog open={isOpen} onOpenChange={handleCloseForm}>
      <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Actualizar {TitlePage}</DialogTitle>
          </DialogHeader>
          <UpdateComponent id={id} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModalDialogUpdate;
