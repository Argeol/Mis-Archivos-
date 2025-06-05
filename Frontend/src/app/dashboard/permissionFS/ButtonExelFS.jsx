"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, Calendar, Loader2, X, ChevronDown } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

export default function ExportExcelButton() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInitialClick = () => {
    setShowDatePicker(true);
  };

  const handleCancel = () => {
    setShowDatePicker(false);
    setStartDate("");
    setEndDate("");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Construye la URL con los parámetros si están definidos
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axiosInstance.get(
        `api/PermissionFS/export?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

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
        : "PermisosFS.xlsx";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      // Resetear el estado después de exportar exitosamente
      setShowDatePicker(false);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!showDatePicker) {
    return (
      <div className="w-full mb-6">
        <Button
          onClick={handleInitialClick}
          className="bg-emerald-600 hover:bg-black text-white font-medium px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Exportar Permisos a Excel
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full mb-5 shadow-lg border-l-4 border-l-blue-500 animate-in slide-in-from-top-2 duration-300">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-black-700">
              <Calendar className="h-5 w-5" />
              <h3 className="font-semibold text-lg">
                Seleccionar Rango de Fechas
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-700"
              >
                Fecha de inicio
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-700"
              >
                Fecha de fin
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={startDate || undefined}
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="text-sm text-blue-700 bg-emerald-50 p-3 rounded-md border border-blue-200 animate-in fade-in duration-200">
              <span className="font-medium">Rango seleccionado:</span>{" "}
              {startDate} - {endDate}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-[#218EED] hover:bg-blue-700 text-white font-medium px-6 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-2" />
                  Confirmar Exportación
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isExporting}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center font-semibold">
            Deja las fechas vacías para exportar todos los permisos
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
