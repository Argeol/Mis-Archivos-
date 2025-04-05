"use client";


import { BiUserCircle } from "react-icons/bi";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Sidebar  from "./sidebar";

function PrivateNav({ children }) {
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
          </nav>
          <main className="flex-1 bg-white p-6">{children}</main>
        </div>
      </div>
    </>
  );
}

export default PrivateNav;
