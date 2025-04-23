"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";

function PrivateNav({ children,titlespage }) {
  const pathname = usePathname();

  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Sidebar */}
      <Sidebar className="h-full shadow-md bg-white/80 backdrop-blur-md" />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar superior */}
        <nav className="bg-white px-6 py-3 flex justify-between items-center border-b border-slate-200 shadow-sm">
          {titlespage === "Contenido Principal" ? (
          <h1 className="text-xl font-semibold text-gray-800 ms-20">
            {titlespage}
            {/* {pathname.includes("/dashboard")
              ? "Contenido Principal"
              : "Gestión de Permisos"} */}
          </h1>
          ): (
            <h1 className="text-xl font-semibold text-gray-800 ms-20">
            Gestionar {titlespage}
            {/* {pathname.includes("/dashboard")
              ? "Contenido Principal"
              : "Gestión de Permisos"} */}
          </h1>
        )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1 rounded-full">
                <UserCircle className="w-8 h-8 text-indigo-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <a href="#" className="flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Configuración</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/user/login" className="flex items-center space-x-2">
                  <span>🚪</span>
                  <span>Cerrar Sesión</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Aquí inyectamos el contenido del dashboard */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PrivateNav;
