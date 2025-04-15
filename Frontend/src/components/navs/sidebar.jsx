import React, { useState } from "react"; 
import { Card } from "@/components/ui/card"; 
import { FaHouseUser, FaCheckCircle, FaUsersCog, FaListAlt, FaBars } from "react-icons/fa"; 
import GroupIcon from "@mui/icons-material/Group"; 
import { useIsMobile } from "./useIsMobile"; 

const menuItems = [
  { href: "/dashboard/apprentice", icon: FaHouseUser, label: "Aprendiz" },
  { href: "/dashboard/file", icon: FaListAlt, label: "Ficha" },
  {
    href: "/dashboard/permissionGeneral",
    icon: FaCheckCircle,
    label: "Permisos",
  },
  { href: "/dashboard/program", icon: FaUsersCog, label: "Programa" },
  { href: "/dashboard/responsible", icon: GroupIcon, label: "Responsables" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante solo en móvil cuando sidebar está cerrado */}
      {isMobile && !isOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-white shadow-md p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <FaBars className="text-2xl text-gray-700" />
        </button>
      )}

      {/* Sidebar: solo visible en desktop o en móvil si está abierto */}
      {(!isMobile || isOpen) && (
        <Card
          className={`fixed top-0 left-0 h-screen bg-slate-100 p-4 pt-6 z-40 transition-all duration-300 border-r border-gray-300 ${
            isOpen ? "w-52" : "w-14"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Logo */}
          {isOpen ? (
            <img
              src="/assets/img/logo.webp"
              alt="Bienesoft Logo Grande"
              className="w-40 h-auto animate-pulse mx-auto hidden sm:block"
            />
          ) : (
            <img
              src="/assets/img/bienesoft.webp"
              alt="Bienesoft Logo Pequeño"
              className="w-10 h-auto mx-auto mb-4 hidden sm:block"
            />
          )}

          {/* Espacio fantasma para evitar salto en móvil */}
          <div className="block sm:hidden h-16" />

          {/* Botón cerrar (solo en móvil) */}
          {isMobile && (
            <button
              className="absolute top-4 right-4 z-50 text-xl"
              onClick={() => setIsOpen(false)}
            >
              ✖️
            </button>
          )}

          {/* Menú */}
          <nav
            className={`mt-5 flex flex-col ${
              isOpen ? "gap-y-3 items-start" : "gap-y-6 items-center"
            }`}
          >
            {menuItems.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className={`flex items-center p-2 rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white transition-colors ${
                  isOpen ? "space-x-3" : "flex-col"
                }`}
              >
                <Icon
                  className={`text-gray-700 transition-all duration-200 ${
                    isOpen
                      ? "w5 h-5"
                      : isMobile
                      ? "w-5 h-5 mx-auto"
                      : "w-5 h-5 mx-auto"
                  }`}
                />
                {isOpen && <span>{label}</span>}
              </a>
            ))}
          </nav>

          {/* Módulo para volver al dashboard */}
          <div className="mt-60">
            <a
              href="http://192.168.184.38:3000/dashboard/"
              className="flex items-center p-2 rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white transition-colors"
            >
              <FaHouseUser className="text-gray-700 transition-all duration-200 w-5 h-5 mx-auto" />
              {isOpen && <span>Volver al Inicio de Modulos</span>}
            </a>
          </div>
        </Card>
      )}
    </>
  );
}
