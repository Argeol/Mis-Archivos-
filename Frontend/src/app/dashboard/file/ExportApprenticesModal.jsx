"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

export default function ExportApprenticesModal() {
    const [fileId, setFileId] = useState("");
    const [open, setOpen] = useState(false);

    const handleExport = async () => {
        try {
            const response = await axiosInstance.get(`api/Apprentice/ExportByFile/${fileId}`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Aprendices_Ficha_${fileId}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("✅ Exportación completada");
            setOpen(false);
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("❌ No existe una ficha con ese ID. Verifícala.");
            } else {
                toast.error("⚠️ Error al exportar aprendices.");
            }
            console.error("Error al exportar:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Exportar Aprendices por Ficha</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Exportar Aprendices</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="fileId">Número de Ficha</Label>
                    <Input
                        id="fileId"
                        type="number"
                        placeholder="Ej: 123456"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                    />
                    <Button onClick={handleExport} disabled={!fileId}>
                        Exportar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
