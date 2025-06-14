"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  FaHouseUser,
  FaHome,
  FaCheckCircle,
  FaUsersCog,
  FaListAlt,
  FaBars,
  FaTimes,
  FaUserShield,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa"
import GroupIcon from "@mui/icons-material/Group"
import { useIsMobile } from "@/hooks/use-mobile"

const menuItems = [
  { href: "/dashboard/apprentice", icon: FaHouseUser, label: "Aprendiz" },
  { href: "/dashboard/file", icon: FaListAlt, label: "Ficha" },
  {
    key: "permissions",
    icon: FaCheckCircle,
    label: "Permisos",
    subItems: [
      { href: "/dashboard/permissionGeneral", label: "Permiso General" },
      { href: "/dashboard/permissionFS", label: "Permiso Internos" },
    ],
  },
  { href: "/dashboard/program", icon: FaUsersCog, label: "Programa" },
  { href: "/dashboard/responsible", icon: GroupIcon, label: "Responsables" },
  { href: "/dashboard/admin", icon: FaUserShield, label: "Administradores" },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [permissionsOpen, setPermissionsOpen] = useState(false)
  const isMobile = useIsMobile()

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false)
  }

  const togglePermissions = () => {
    setPermissionsOpen(!permissionsOpen)
  }

  return (
    <>
      {isMobile && !isOpen && (
        <button
          className="w-8 h-8 fixed top-4 left-4 z-50 bg-white shadow-md p-1 rounded-md "
          onClick={() => setIsOpen(true)}
        >
          <FaBars className="text-2xl text-gray-700 " />
        </button>
      )}

      {(!isMobile || isOpen) && (
        <Card
          className={`fixed top-0 left-0 h-screen bg-slate-100 p-4 pt-6 z-40 transition-all duration-300 border-r border-gray-300 ${
            isOpen ? "w-52" : "w-16"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            {isOpen ? (
              <img
                src="/assets/img/logo.webp"
                alt="Bienesoft Logo Grande"
                className="w-40 h-auto animate-pulse mx-auto"
              />
            ) : (
              <img src="/assets/img/bienesoft.webp" alt="Bienesoft Logo Pequeño" className="w-10 h-auto mx-auto" />
            )}
          </div>

          {/* Botón cerrar (solo en móvil) */}
          {isMobile && (
            <button
              className="absolute top-4 right-[3px] z-50 text-xl bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
            >
              <FaTimes className="text-gray-700" />
            </button>
          )}

          {/* Menú */}
          <nav
            className={`mt-2 flex flex-col ${isOpen ? "gap-y-3 items-start" : "gap-y-4 items-center justify-center"}`}
          >
            {menuItems.map((item) => {
              // Si el item tiene subItems (como permisos)
              if (item.subItems) {
                return (
                  <div key={item.key} className="w-full">
                    {/* Item principal de permisos */}
                    <button
                      onClick={togglePermissions}
                      className={`flex items-center rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white transition-colors ${
                        isOpen ? "p-3 space-x-3 justify-between w-full" : "p-2 justify-center w-10 h-10 mx-auto"
                      }`}
                    >
                      <div className={`flex items-center ${isOpen ? "space-x-3" : "justify-center"}`}>
                        <item.icon
                          className={`text-gray-700 transition-all duration-200 w-5 h-5 ${isOpen ? "" : "mx-auto"}`}
                        />
                        {isOpen && <span>{item.label}</span>}
                      </div>
                      {isOpen &&
                        (permissionsOpen ? (
                          <FaChevronDown className="w-3 h-3 text-gray-700" />
                        ) : (
                          <FaChevronRight className="w-3 h-3 text-gray-700" />
                        ))}
                    </button>

                    {/* Submenú de permisos */}
                    {isOpen && permissionsOpen && (
                      <div className="ml-6 mt-2 space-y-2 ">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.href}
                            href={subItem.href}
                            className="flex items-center p-2 pl-3 rounded-md text-gray-400 hover:bg-[#218EED] hover:text-white transition-colors text-sm border-l-2 border-blue-300"
                          >
                            <span>{subItem.label}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              // Items normales sin submenú
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white transition-colors ${
                    isOpen ? "p-3 space-x-3 justify-start w-full" : "p-2 justify-center w-10 h-10 mx-auto"
                  }`}
                >
                  <item.icon
                    className={`text-gray-700 transition-all duration-200 w-5 h-5 ${isOpen ? "" : "mx-auto"}`}
                  />
                  {isOpen && <span>{item.label}</span>}
                </a>
              )
            })}
          </nav>

          {/* Línea divisoria antes del inicio */}
          <hr className="border-t border-gray-300 my-4 mx-2" />

          {/* Módulo para volver al dashboard */}
          <div className="mt-auto">
            <a
              href="/dashboard"
              className={`flex items-center rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white transition-colors ${
                isOpen ? "p-2 space-x-3 justify-start w-full" : "p-2 justify-center w-10 h-10 mx-auto"
              }`}
            >
              <FaHome className={`text-gray-700 w-5 h-5 ${isOpen ? "" : "mx-auto"}`} />
              {isOpen && <span>Inicio</span>}
            </a>
          </div>
        </Card>
      )}
    </>
  )
}
