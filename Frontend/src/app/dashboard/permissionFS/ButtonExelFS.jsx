"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function ExportExcelButton() {
  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("api/PermissionFS/export", {
        responseType: "blob", // Asegúrate de que el backend retorne el archivo como blob
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Tipo Excel
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const disposition = response.headers["content-disposition"];
      const fileNameMatch = disposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      const fileName = fileNameMatch ? fileNameMatch[1].replace(/['"]/g, "") : "PermisosFS.xlsx";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar Excel:", error);
    }
  };

  return (
    <div className="w-full flex justify-start mb-4 -mt-10">
      <Button
        onClick={handleExport}
        variant="outline"
        className="flex items-center text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
      >
        <FileDown className="h-4 w-4" />
        Exportar a Excel
      </Button>
    </div>
  );
}
