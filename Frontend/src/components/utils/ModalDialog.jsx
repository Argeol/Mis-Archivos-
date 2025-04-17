import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

function ModalDialog({ TitlePage, RegisterComponets, }) {
  const [isOpen, SetisOpen] = useState(false);

  const handleOpen = () => {
    SetisOpen(true);
  };
  const handleCloseForm = () => {
    SetisOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>registrar {TitlePage}</Button>
      <Dialog open={isOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="w-[95%] max-w-md sm:max-w-xl sm:rounded-xl max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Agrega {TitlePage}</DialogTitle>
            <RegisterComponets></RegisterComponets>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModalDialog;
