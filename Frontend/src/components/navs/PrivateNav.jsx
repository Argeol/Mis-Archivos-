"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { UserCircle, LogOut, User, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import { useAuthUser } from "@/app/user/login/useCurrentUser";
import { useUserInfo } from "@/app/user/login/useUserInfo";
import UserInfoModal from "@/app/user/login/userInfoModal";

function PrivateNav({ children, titlespage }) {
  const pathname = usePathname();
  const user = useAuthUser();

  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const userToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authUser = useAuthUser();
  const { data: userData } = useUserInfo(authUser?.role, userToken);

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {user.role === "Administrador" && (
        <div className="mt-4">
          <Sidebar className="h-full shadow-md bg-white/80 backdrop-blur-md" />
        </div>
      )}

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
          ) : (
            <h1 className="text-xl font-semibold text-gray-800 ms-20">
              Gestionar {titlespage}
              {/* {pathname.includes("/dashboard")
              ? "Contenido Principal"
              : "Gestión de Permisos"} */}
            </h1>
          )}
          <UserInfoModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)} 
            user={userData}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className=" rounded-full">
                <UserCircle className="w-8 h-8 text-indigo-500 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              <DropdownMenuItem
                className="font-medium cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex space-x-2">
                  <User className="h-4 w-4" />
                  <p>Información Usuario</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-[#218EED]" />
                  <span className="truncate">{user.email}</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <a href="/user/login" className="flex items-center  ">
                  <LogOut className="h-4 w-4 text-red-600 " />
                  <span>Cerrar Sesión</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        {/* Aquí inyectamos el contenido del dashboard */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default PrivateNav;
