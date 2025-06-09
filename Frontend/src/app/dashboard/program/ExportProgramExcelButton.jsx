"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function ExportProgramExcelButton() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await axiosInstance.get("/api/Program/export", {
                responseType: "blob",
            });

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const disposition = response.headers["content-disposition"];
            const fileNameMatch = disposition?.match(
                /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
            );
            const fileName = fileNameMatch
                ? fileNameMatch[1].replace(/['"]/g, "")
                : "Programas.xlsx";

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al exportar programas:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-emerald-600 hover:bg-black text-white font-medium px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
        >
            {isExporting ? (
                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                </>
            ) : (
                <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Exportar Programas a Excel
                </>
            )}
        </Button>
    );
}
