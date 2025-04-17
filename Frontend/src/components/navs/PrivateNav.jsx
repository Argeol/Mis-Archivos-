"use client";

import { useState, useEffect } from "react";
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
// import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "lucide-react";

function PrivateNav({ children }) {
  const pathname = usePathname();

  // Estado para manejar el tema
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // Cambia el atributo de tema en el HTML
  };

  // Aplicar el tema al cargar la página
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  // const { toast } = Toast();
  // const handleconfigclick=() => {
  //   toast({
  //     title: "sesion en desarrollo",
  //     description:"estamos trabajando en ello fuertemente. Gracias por su paciencia!",
  //     variant: "default",
  //   });
  // }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gradient-to-tr from-slate-100 via-indigo-100 to-blue-100"}`}>
      {/* Sidebar con altura completa */}
      <Sidebar className="h-full shadow-md bg-white/80 backdrop-blur-md" />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar superior con fondo glassmorphism */}
        <nav className={`bg-white/60 backdrop-blur-md shadow-md px-6 py-3 flex justify-between items-center border-b border-slate-200 ${theme === "dark" ? "bg-gray-800" : ""}`}>
          <div></div> {/* Aquí puedes poner un logo o algo más si lo necesitas */}

          {/* Menú desplegable de usuario */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-1 rounded-full bg-white shadow-md hover:bg-indigo-100 transition-all duration-200"
              >
                <UserCircle className={`w-12 h-12 ${theme === "dark" ? "text-white" : "text-indigo-500"} hover:${theme === "dark" ? "text-indigo-700" : "text-indigo-500"} transition-colors`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/90 backdrop-blur-md shadow-lg border border-slate-200">
              <DropdownMenuItem asChild>
                <a href= "#" 
                onClick={() => alert("Sesión en desarrollo. Estamos trabajando en ello fuertemente. Gracias por su paciencia!")}
                className="flex items-center space-x-2">
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
          
          {/* Botón para cambiar tema */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-4">
            {theme === "dark" ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5 text-blue-500" />}
          </Button>
        </nav>

        {/* Contenido principal con scroll si es necesario */}
        <main className="flex-1 overflow-y-auto p-6 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-inner">
          {pathname === "/dashboard" && (
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-gray-800 drop-shadow-sm">
                ¡Bienvenidos a nuestro Dashboard Bienesoft!
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Aquí puedes hacer tus consultas, creaciones, eliminaciones y actualizaciones de datos.
              </p>
            </div>
          )}
          <div className="mt-6">{children}</div> {/* Aquí se renderiza el contenido dinámico */}
        </main>
      </div>
    </div>
  );
}

export default PrivateNav;
