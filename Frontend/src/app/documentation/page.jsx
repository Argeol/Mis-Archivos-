"use client";

import {
  FileText,
  Download,
  Maximize2,
  Calendar,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Footer from "@/components/navs/Footer";
import PublicNav from "@/components/navs/PublicNav";

const Documento = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/docs/ManualT.pdf";
    link.download = "Manual_Tecnico_Bienesoft.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />

      {/* Título principal centrado con ícono y resumen */}
      <section className="container pt-32 pb-20 px-4 max-w-5xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center shadow">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
            Manual Técnico Bienesoft
          </h1>
        </div>

        <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
          Este manual técnico presenta una visión integral del desarrollo y funcionamiento de Bienesoft, abordando su arquitectura, tecnologías utilizadas y pautas de mantenimiento. Está dirigido a desarrolladores, administradores y personal técnico que requiera comprender el sistema en profundidad.
        </p>

        {/* Metadatos de actualización */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>
              Actualizado el{" "}
              {new Date().toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 shadow-sm">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Equipo de Desarrollo Bienesoft</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <a href="/assets/docs/ManualT.pdf" target="_blank" rel="noopener noreferrer">
            <Button className="w-60 bg-blue-600 hover:bg-blue-700 text-white h-11">
              <Maximize2 className="w-4 h-4 mr-2" />
              Ver PDF
            </Button>
          </a>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-60 border-blue-300 text-blue-700 hover:bg-blue-50 h-11"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Documento;
