"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { UserCircle, LogOut, User, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import { useAuthUser } from "@/app/user/login/useCurrentUser";
import { useUserInfo } from "@/app/user/login/useUserInfo";
import UserInfoModal from "@/app/user/login/userInfoModal";

function PrivateNav({ children, titlespage }) {
  const pathname = usePathname();
  const userData = useAuthUser(); // Obtiene la información del usuario
  const [theme, setTheme] = useState("light"); // Estado local para el tema, puedes hacerlo con contexto global si es necesario

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // // Se obtiene la información del usuario directamente desde el hook
  // const { data: userData } = useUserInfo();

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}>
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
            {titlespage === "Contenido Principal" ? titlespage : `Gestionar ${titlespage}`}
          </h1>
          <UserInfoModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={userData}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full">
                <UserCircle className="w-8 h-8 text-indigo-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem
                className="font-medium cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex space-x-2">
                  <User className="h-4 w-4" />
                  <p>Información Usuario</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-[#218EED]" />
                  <span className="truncate">{userData?.email}</span>
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

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default PrivateNav;
