import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { FaHouseUser, FaCheckCircle, FaUsersCog, FaListAlt } from "react-icons/fa";
import GroupIcon from "@mui/icons-material/Group";

const menuItems = [
  { href: "/dashboard/apprentice", icon: FaHouseUser, label: "Aprendiz" },
  { href: "/dashboard/file", icon: FaListAlt, label: "Ficha" },
  { href: "/dashboard/permissionGeneral", icon: FaCheckCircle, label: "Permisos" },
  { href: "/dashboard/program", icon: FaUsersCog, label: "Programa" },
  { href: "/dashboard/responsible", icon: GroupIcon, label: "Responsables" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card
      className={`h-screen bg-slate-10 p-4 transition-all duration-300 border-0 ${isOpen ? "w-52" : "w-20"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Mostrar logo diferente según estado del sidebar */}
      {isOpen ? (
        <img
          src="/assets/img/logo.webp"
          alt="Bienesoft Logo Grande"
          className="w-40 h-auto animate-pulse mx-auto"
        />
      ) : (
        <img
          src="/assets/img/bienesoft.webp"
          alt="Bienesoft Logo Pequeño"
          className="w-10 h-auto mx-auto mb-4"
        />
      )}

      {/* Menú con margen superior */}
      <nav className="space-y-3 mt-5">
        {menuItems.map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            className="flex items-center space-x-3 p-2 rounded-md text-gray-500 hover:bg-[#218EED] hover:text-white"
          >
            <Icon className="text-xl" />
            {isOpen && <span>{label}</span>}
          </a>
        ))}
      </nav>
    </Card>
  );
}
