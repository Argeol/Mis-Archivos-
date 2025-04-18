"use client"

import { usePathname } from "next/navigation"
import { UserCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"
import Dashboard from "./dashboard"

function PrivateNav({ children }) {
  const pathname = usePathname()

  // Determinar si estamos en la ruta principal del dashboard
  const isMainDashboard = pathname === "/dashboard" || pathname === "/dashboard/"

  return (
    <div className="flex h-screen bg-gradient-to-tr from-slate-100 via-indigo-100 to-blue-100">
      {/* Sidebar con altura completa */}
      <Sidebar className="h-full shadow-md bg-white/80 backdrop-blur-md" />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar superior con fondo glassmorphism */}
        <nav className="bg-white/60 backdrop-blur-md shadow-md px-6 py-3 flex justify-between items-center border-b border-slate-200">
          <div>
            {/* Mostrar el título del módulo actual basado en la ruta */}
            <h1 className="text-xl font-semibold text-gray-800 ms-20" >
              {isMainDashboard
                ? "Dashboard"
                : pathname.includes("/apprentice")
                  ? "Gestión de Aprendices"
                  : pathname.includes("/file")
                    ? "Gestión de Fichas"
                    : pathname.includes("/permissionGeneral")
                      ? "Gestión de Permisos"
                      : pathname.includes("/program")
                        ? "Gestión de Programas"
                        : pathname.includes("/responsible")
                          ? "Gestión de Responsables"
                          : "Dashboard"}
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-1 rounded-full bg-white shadow-md hover:bg-indigo-100 transition-all duration-200"
              >
                <UserCircle className="w-12 h-12 text-indigo-500 hover:text-indigo-700 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white/90 backdrop-blur-md shadow-lg border border-slate-200"
            >
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

        {/* Contenido principal con scroll si es necesario */}
        <main className="flex-1 overflow-y-auto p-6 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-inner">
          {/* Renderizar condicionalmente el Dashboard o el contenido específico del módulo */}
          {isMainDashboard ? <Dashboard /> : <div className="animate-fadeIn">{children}</div>}
        </main>
      </div>
    </div>
  )
}

export default PrivateNav
