"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FaHouseUser, FaHome, FaCheckCircle, FaUsersCog, FaListAlt, FaBars, FaTimes, FaUserShield } from "react-icons/fa"
import GroupIcon from "@mui/icons-material/Group"
import { useIsMobile } from "@/hooks/use-mobile"
const menuItems = [
  { href: "/dashboard/apprentice", icon: FaHouseUser, label: "Aprendiz" },
  { href: "/dashboard/file", icon: FaListAlt, label: "Ficha" },
  { href: "/dashboard/permissionGeneral", icon: FaCheckCircle, label: "Permisos" },
  { href: "/dashboard/program", icon: FaUsersCog, label: "Programa" },
  { href: "/dashboard/responsible", icon: GroupIcon, label: "Responsables" },
  { href: "/dashboard/admin", icon: FaUserShield, label: "Administradores" }, 
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false)
  }

  return (
    <>
      {isMobile && !isOpen && (
        <button className="fixed top-4 left-4 z-50 bg-white shadow-md p-2 rounded-md" onClick={() => setIsOpen(true)}>
          <FaBars className="text-2xl text-gray-700" />
        </button>
      )}

      {(!isMobile || isOpen) && (
        <Card
          className={`fixed top-0 left-0 h-screen bg-slate-100 p-4 pt-6 z-40 transition-all duration-300 border-r border-gray-300 ${
            isOpen ? "w-52" : "w-14"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            {isOpen ? (
              <img src="/assets/img/logo.webp" alt="Bienesoft Logo Grande" className="w-40 h-auto animate-pulse mx-auto" />
            ) : (
              <img src="/assets/img/bienesoft.webp" alt="Bienesoft Logo Pequeño" className="w-10 h-auto mx-auto" />
            )}
          </div>

          {/* Botón cerrar (solo en móvil) */}
          {isMobile && (
            <button
              className="absolute top-4 right-4 z-50 text-xl bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
            >
              <FaTimes className="text-gray-700" />
            </button>
          )}

          {/* Menú */}
          <nav className={`mt-2 flex flex-col ${isOpen ? "gap-y-3 items-start" : "gap-y-6 items-center"}`}>
            {menuItems.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className={`flex items-center p-2 rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white transition-colors w-full ${
                  isOpen ? "space-x-3 justify-start" : "flex-col justify-center"
                }`}
              >
                <Icon className={`text-gray-700 transition-all duration-200 ${isOpen ? "w-5 h-5" : "w-5 h-5 mx-auto"}`} />
                {isOpen && <span>{label}</span>}
              </a>
            ))}
          </nav>

          {/* Línea divisoria antes del inicio */}
          <hr className="border-t border-gray-300 my-4 mx-2" />

          {/* Módulo para volver al dashboard */}
          <div className="mt-auto">
            <a
              href="/dashboard"
              className={`flex items-center p-2 rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white transition-colors w-full ${
                isOpen ? "space-x-3 justify-start" : "flex-col justify-center"
              }`}
            >
              <FaHome className="text-gray-700" />
              {isOpen && <span>Inicio</span>}
            </a>
          </div>
        </Card>
      )}
    </>
  )
}
