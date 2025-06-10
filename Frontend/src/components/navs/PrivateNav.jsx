"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle, LogOut, Mail, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import { useAuthUser } from "@/app/user/login/useCurrentUser";
import { UserInfoModal } from "@/app/user/login/useUserInfo";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { useEffect } from "react";

function PrivateNav({ children, titlespage }) {

  const [isTokenValid, setIsTokenValid] = useState(null); // null: cargando, true/false: resultado
  // const pathname = usePathname();
  const { user, tip, isLoading: loadingUser, error: errorUser } = useAuthUser();
  const [theme, setTheme] = useState("light"); // Estado local para el tema
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/User/logout",
        {},
        { withCredentials: true }
      );
      toast(response.data.message)
      router.push("/user/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axiosInstance.get("/api/User/ValidateToken");

        // Como siempre responde 200, solo usamos la propiedad isValid
        if (response.data.isValid === true) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Error inesperado al validar token:", error);
        setIsTokenValid(false); // Por si falla por otros motivos (red, etc.)
      }
    };

    validateToken();
  }, []);

  // Manejo de la carga y error antes de renderizar el componente

  if (loadingUser) return <p>Cargando...</p>;
  if (errorUser) return <p>Error: {errorUser.message}</p>;
  // Título dinámico para la página
  const pageTitle =
    titlespage === "Contenido Principal"
      ? titlespage
      : `Gestionar ${titlespage}`;
  if (isTokenValid === null) return <p>Validando sesión...</p>;

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="p-6 bg-white rounded shadow text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Sesión no válida
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Inicia sesión con tu usuario para acceder a esta página.
          </p>
          <Button className="mt-4" onClick={() => router.push("/user/login")}>
            Ir al inicio de sesión
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`flex h-screen ${theme === "dark" ? "bg-gray-900" : "bg-white"
        }`}
    >

      {/* Sidebar solo visible para administradores */}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar superior */}
        <nav className="bg-white px-3  flex justify-between items-center border-b border-slate-200 shadow-sm  ">
          {tip === "Administrador" && (
            <div className="">
              <Sidebar className="h-full shadow-md bg-white/80 backdrop-blur-md " />
            </div>
          )}
          {tip === "Aprendiz" && (
            <div className="flex justify-center items-center mt-5">
              <img
                src="assets/img/bienesoft.webp"
                title="BIENESOFT"
                className="w-16 h-16 object-contain animate-bounce"
              />
            </div>
          )}
          <h1 className="text-xl font-extrabold text-gray-800 ms-16 ">
            {pageTitle}
          </h1>


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full">
                <UserCircle className="w-8 h-8 text-indigo-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem disabled>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-[#218EED]" />
                  <span className="truncate">{user?.email_Apprentice || user?.email_Responsible || user?.email}</span>
                </div>
              </DropdownMenuItem>

              {(tip === "Aprendiz" || tip === "Responsable") && (
                <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>Más Información</span>
                  </div>
                </DropdownMenuItem>
              )}
              {/* Opción para abrir el modal con más información */}

              <DropdownMenuItem onClick={handleLogout}>
                <div className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Cerrar Sesión</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        {isModalOpen && (
          <UserInfoModal
            Tip={tip}
            Data={user}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default PrivateNav;
