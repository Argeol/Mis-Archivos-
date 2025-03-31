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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className={`h-screen bg-slate-100 p-4 transition-all duration-300 ${isOpen ? "w-54" : "w-20"} border-0`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <img
        src="/assets/img/logo.webp"
        alt="Bienesoft Logo"
        className="w-40 h-auto animate-pulse"
      />

      <br />

      <nav className="space-y-3">
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
