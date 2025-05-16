"use client";

import {
  Mail,
  Calendar,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  UserIcon,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import UpdateResponsible from "@/app/dashboard/responsible/updateResponsible";

export function UserInfoModal({ userData, open, onClose }) {
  console.log(userData)
  const modalRef = useRef(null);
  const [data, setData] = useState(null);
  const [translations, setTranslations] = useState({});
  const [ignorar, setIgnorar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    if (!userData) return;

    const role = userData;
    let newUrl = "";
    let newTranslations = {};
    let ignoreFields = [];

    if (role === "Aprendiz") {
      newUrl = "/api/Apprentice/GetApprenticeById";
      newTranslations = {
        id_Apprentice: "Numero de Documento",
        first_Name_Apprentice: "Nombres",
        last_Name_Apprentice: "Apellidos",
        address_Type_Apprentice: "Localidad",
        address_Apprentice: "Nombre de Localidad",
        birth_Date_Apprentice_Formatted: "Fecha de Nacimiento",
        phone_Apprentice: "Numero Telefonico",
        gender_Apprentice: "Genero",
        tip_Apprentice: "Tipo de Aprendiz",
        nom_responsible: "Nombres de Responsable",
        ape_responsible: "Apellidos de Responsable",
        email_responsible: "Correo de Responsable",
        tel_responsible: "Telefono de Responsable",
        municipalityName: "Municipio de Recidencia",
        departmentName: "Departamento de Recidencia",
        file_Id: "Codigo de Ficha",
        programName: "Programa de Formacion",
        areaName: "Area",
      };
      ignoreFields = [
        "id_municipality",
        "status_Apprentice",
        "email_Apprentice",
      ];
    } else if (role === "Responsable") {
      newUrl = "/api/Responsible/GetResponsibleID";
      newTranslations = {
        responsible_Id: "Numero de Documento",
        nom_Responsible: "Nombres",
        ape_Responsible: "Apellidos",
        tel_Responsible: "Numero Telefonico",
        name_role: "Rol",
        state: "Estado",
      };
      ignoreFields = ["email_Responsible"];
    } else {
      return;
    }

    setUrl(newUrl);
    setTranslations(newTranslations);
    setIgnorar(ignoreFields);
  }, [userData]);

  useEffect(() => {
    if (open && url) {
      fetchData();
    }
  }, [open, url]);

  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && typeof onClose === "function") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (err) {
      console.error("Error al obtener los datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const getIconForKey = (key) => {
    const keyLower = key.toLowerCase();
    // if (keyLower.includes("name") || keyLower.includes("nombre")) return <UserIcon className="h-5 w-5 text-rose-500" />
    if (keyLower.includes("correo") || keyLower.includes("email"))
      return <Mail className="h-5 w-5 text-amber-500" />;
    if (
      keyLower.includes("fecha") ||
      keyLower.includes("birth") ||
      keyLower.includes("date")
    )
      return <Calendar className="h-5 w-5 text-emerald-500" />;
    return <ChevronRight className="h-5 w-5 text-slate-400" />;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Aprendiz":
        return <GraduationCap className="h-4.3 w-4.3 text-blue-500 mr-1" />;
      case "Responsable":
        return <UserCheck className="h-4.5 w-4.5 text-green-500 mr-1" />;
      case "Administrador":
        return <ShieldCheck className="h-3.5 w-3.5 text-red-500 mr-1" />;
      default:
        return <ShieldCheck className="h-3.5 w-3.5 text-slate-400 mr-1" />;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-6 py-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
          </div>
          <Separator />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="p-6 rounded-xl bg-slate-50 border-l-4 border-slate-300 my-4">
          <h3 className="text-slate-700 font-semibold">Sin datos</h3>
          <p className="text-slate-600 mt-1">
            No hay información disponible para mostrar.
          </p>
        </div>
      );
    }
    // if (isloading) return <p>Cargando...</p>;
    // if (error) return <p>Error: {error.message}</p>;
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-200 to-[#068EED] flex items-center justify-center text-white font-serif text-xl shadow-sm">
            {(userData?.fullName?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-medium">Usuario</h3>
            <div className="flex items-center mt-0.5">
              {getRoleIcon(userData)}
              <span className="text-sm text-slate-500">{userData}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-5 max-h-[calc(90vh-250px)] overflow-y-auto pr-2">
          {Object.entries(data).map(([key, value]) => {
            if (ignorar.includes(key) || !translations[key]) return null;
            return (
              <div key={key} className="group">
                <div className="flex items-center gap-2 mb-1">
                  {getIconForKey(key)}
                  <span className="text-sm font-medium text-slate-500">
                    {translations[key]}
                  </span>
                </div>
                <p className="pl-7 text-slate-800 font-medium break-words">
                  {String(value) || "-"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300 ease-out"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <Card
        ref={modalRef}
        className="w-full max-w-md shadow-xl animate-in fade-in-0 slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-hidden rounded-xl border-0 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border-b">
          <h2
            id="modal-title"
            className="text-xl font-semibold flex items-center gap-2"
          >
            <span className="bg-gradient-to-r from-slate-600 to-[#088EED] bg-clip-text text-transparent">
              Información de {userData || "Usuario"}
            </span>
          </h2>
        </div>
        <CardContent className="p-5 overflow-y-auto">
          {showUpdateForm ? <UpdateResponsible /> : renderContent()}
        </CardContent>

        <div className="p-4 border-t bg-slate-50">
          <div className="flex flex-col-reverse md:flex-row md:justify-end md:items-center gap-3 md:gap-4 w-full">
            <Button
              onClick={onClose}
              className="w-full md:w-auto bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all"
            >
              Cerrar
            </Button>

            {userData?.role === "Responsable" && (
              <Button
                variant="outline"
                onClick={() => {
                  if (showUpdateForm) {
                    fetchData();
                  }
                  setShowUpdateForm(!showUpdateForm);
                }}
                className="w-full md:w-auto bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white px-6 py-2 shadow-md hover:shadow-lg transition-all"
              >
                {showUpdateForm ? "Volver" : "Actualizar Información"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
