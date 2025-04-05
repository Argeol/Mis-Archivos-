"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RowInfoModal({
  isOpen,
  onClose,
  selectedRow,
  TitlePage,
  translations,
  ignorar,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-4">
            Información Completa del {TitlePage}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selectedRow &&
            Object.entries(selectedRow)
              .filter(([key]) => !ignorar?.includes(key))
              .map(([key, value]) => (
                <div key={key} className="bg-gray-100 rounded-xl p-3 shadow-sm">
                  <p className="text-sm text-gray-500 font-medium">
                    {translations[key] || key}
                  </p>
                  <p className="text-base text-gray-800">
                    {value?.toString()}
                  </p>
                </div>
              ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
