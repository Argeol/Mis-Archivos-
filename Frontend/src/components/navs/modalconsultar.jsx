import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function ReadModal({ isOpen, onClose, user }) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p><strong>Name:</strong> {user[2]}</p>
          <p><strong>Document:</strong> {user[1]}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReadModal;
