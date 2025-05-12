"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
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

function PrivateNav({ children, titlespage }) {
  const pathname = usePathname();
  const { userData, loading, error } = useAuthUser(); // Obtiene la información del usuario
  const [theme, setTheme] = useState("light"); // Estado local para el tema
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Manejo de la carga y error antes de renderizar el componente
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Título dinámico para la página
  const pageTitle =
    titlespage === "Contenido Principal"
      ? titlespage
      : `Gestionar ${titlespage}`;

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Sidebar solo visible para administradores */}
      {userData?.role === "Administrador" && (
        <div className="mt-4">
          <Sidebar className="h-full shadow-md bg-white/80 backdrop-blur-md" />
        </div>
      )}

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar superior */}
        <nav className="bg-white px-6 py-3 flex justify-between items-center border-b border-slate-200 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800 ms-20">
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
                  <span className="truncate">{userData?.email}</span>
                </div>
              </DropdownMenuItem>

              {/* Opción para abrir el modal con más información */}
              <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span>Más Información</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <a href="/user/login" className="flex items-center">
                  <LogOut className="h-4 w-4 text-red-600" />
                  <span>Cerrar Sesión</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
             {isModalOpen && (
            <UserInfoModal
              userData={userData}
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
