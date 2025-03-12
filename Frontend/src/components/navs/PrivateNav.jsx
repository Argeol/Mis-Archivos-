"use client";

import { motion } from "framer-motion";
import { BiUserCircle } from "react-icons/bi";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar  from "./sidebar"; // Asegúrate de que este componente esté adaptado

function PrivateNav({ children }) {
  return (
    <>
      <div className="flex h-screen bg-slate-100">
        {/* Barra lateral */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Barra de navegación superior */}
          <nav className="bg-slate-100 shadow-sm">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
              {/* Logo animado */}
              <a href="/" className="flex items-center">
                <motion.div
                  initial={{ x: "-100vw" }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 90 }}
                  whileHover={{ scale: 1.1, rotate: 1 }}
                >
                  <img
                    src="/assets/img/logo.webp"
                    alt="Bienesoft Logo"
                    className="w-40 h-auto"
                  />
                </motion.div>
              </a>

              {/* Menú desplegable */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 text-blue-500">
                    <BiUserCircle className="text-3xl" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <a
                      href="/configuracion"
                      className="flex items-center space-x-2"
                    >
                      <span>⚙️</span>
                      <span>Configuración</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href="/logout"
                      className="flex items-center space-x-2"
                    >
                      <span>🚪</span>
                      <span>Cerrar Sesión</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>

          {/* Contenido principal */}
          <main className="flex-1 bg-white p-6">{children}</main>
        </div>
      </div>
    </>
  );
}

export default PrivateNav;
