"use client";

import {
  Mail,
  Calendar,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function UserInfoModal({ userData, open, onClose }) {
  const modalRef = useRef(null);
  const [data, setData] = useState(null);
  const [translations, setTranslations] = useState({});
  const [ignorar, setIgnorar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!userData) return;

    const role = userData.role;
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
        email_Apprentice: "Correo electronico",
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
      ignoreFields = ["id_municipality", "status_Apprentice"];
    } else if (role === "Responsable") {
      newUrl = "/api/Responsible/GetResponsibleID";
      newTranslations = {
        responsible_Id: "Numero de Documento",
        nom_Responsible: "Nombres",
        ape_Responsible: "Apellidos",
        tel_Responsible: "Numero Telefonico",
        name_role: "Rol",
        state: "Estado",
        email_Responsible: "Correo electronico",
      };
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
      onClose(); // cerrar modal externamente
    }
  };

  const getIconForKey = (key) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes("name")) return <UserIcon className="h-5 w-5 text-rose-500" />;
    if (keyLower.includes("correo") || keyLower.includes("email")) return <Mail className="h-5 w-5 text-amber-500" />;
    if (keyLower.includes("fecha") || keyLower.includes("birth")) return <Calendar className="h-5 w-5 text-emerald-500" />;
    return <ChevronRight className="h-5 w-5 text-slate-400" />;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Aprendiz":
        return <GraduationCap className="h-4 w-4 text-blue-500 mr-1" />;
      case "Responsable":
        return <UserCheck className="h-4 w-4 text-green-500 mr-1" />;
      default:
        return <ShieldCheck className="h-4 w-4 text-slate-400 mr-1" />;
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
      return <p className="text-center text-muted-foreground">No hay datos disponibles.</p>;
    }

    return (
      <div className="max-h-[400px] overflow-y-auto">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-200 to-[#068EED] flex items-center justify-center text-white font-serif text-xl shadow-sm">
            {(userData?.fullName?.[0] || "U").toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-medium">Usuario</h3>
            <div className="flex items-center mt-0.5">
              {getRoleIcon(userData?.role)}
              <span className="text-sm text-slate-500">{userData?.role}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2">
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
                <p className="pl-7 text-slate-800 font-medium break-words">{String(value) || "-"}</p>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleBackdropClick}
    >
      <Card
        ref={modalRef}
        className="w-full max-w-md shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-hidden rounded-xl border-0 ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">{renderContent()}</div>
      </Card>
    </div>
  );
}
