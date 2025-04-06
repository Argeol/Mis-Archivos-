"use client";

import { usePathname } from "next/navigation"; // Importamos usePathname
import { BiUserCircle } from "react-icons/bi";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";

function PrivateNav({ children }) {
  const pathname = usePathname(); // Obtiene la ruta actual

  return (
    <>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <nav className="bg-slate-100 shadow-sm px-6 py-4 flex justify-between items-center">
            <div></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2 text-blue-500">
                  <BiUserCircle/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <a href="/configuracion" className="flex items-center space-x-2">
                    <span>⚙️</span>
                    <span>Configuración</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/logout" className="flex items-center space-x-2">
                    <span>🚪</span>
                    <span>Cerrar Sesión</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Contenido principal */}
          <main className="flex-1 bg-white p-6 flex flex-col items-center justify-center text-center">
            {/* Solo mostramos el mensaje si estamos en /dashboard */}
            {pathname === "/dashboard" && (
              <>
                <h1 className="text-2xl font-bold text-gray-800">
                  ¡Bienvenidos a nuestro Dashboard Bienesoft!
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Aquí puedes hacer tus consultas, creaciones, eliminaciones y actualizaciones de datos.
                </p>
              </>
            )}
            <div className="mt-6">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

export default PrivateNav;
