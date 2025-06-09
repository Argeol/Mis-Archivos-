"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

export default function ImportProgramButton() {
  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleImport = async () => {
    if (!file) {
      toast.warning("Por favor selecciona un archivo.");
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/api/Program/import", formData);
      toast.success(response.data.message || "Importación exitosa.");
      setFile(null);
    } catch (error) {
      console.error("Error al importar:", error);
      toast.error(
        error.response?.data?.message || "Ocurrió un error al importar."
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="space-y-2 mb-4">
        <Label htmlFor="file">Selecciona archivo Excel</Label>
        <Input
          id="file"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          disabled={isImporting}
        />
      </div>

      <Button
        onClick={handleImport}
        disabled={isImporting || !file}
        className="bg-blue-600 hover:bg-blue-800 text-white"
      >
        {isImporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Importando...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Importar Programas
          </>
        )}
      </Button>
    </div>
  );
}
