import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

function ModalDialogUpdate({ TitlePage, UpdateComponent, id, isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Actualizar {TitlePage}</DialogTitle>
        </DialogHeader>
        <UpdateComponent id={id} closeModal={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default ModalDialogUpdate;
