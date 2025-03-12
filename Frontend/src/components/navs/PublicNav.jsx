"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaHome, FaListAlt, FaDollarSign, FaEnvelope, FaFileAlt,FaUserFriends,} from "react-icons/fa";

function PublicNav() {
  return (
    <header className="px-4 lg:px-6 h-16 border-b flex items-center justify-between bg-slate-100 shadow-sm">
      <Link className="flex items-center justify-center" href="/">
        <motion.div
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 90 }}
          whileHover={{ scale: 1.3, rotate: 1 }}
        >
          <img
            src="/assets/img/logo.webp"
            alt="Bienesoft Logo"
            style={{ width: "170px", height: "auto" }}
          />
        </motion.div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-4 lg:space-x-10">
        <Link
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          href="/aboutUs"
        >
          <FaListAlt className=" text-[#218EED]"/>
          ¿Quienes Somos?
        </Link>
        <Link
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          href="/contacts"
        >
          <FaUserFriends className=" text-[#218EED]" />
          Contacto
        </Link>
        <Link
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          href="/documentation"
        >
          <FaFileAlt className="text-[#218EED]" />
          Documentos
        </Link>

        <button className="btn relative w-24 h-9 rounded-2xl text-sm font-inherit cursor-pointer overflow-hidden  shadow-[10px_2px_25px_#91a0b9,10px_6px_2px_#91a0b9] bg-[#218EED] border-none flex items-center justify-center group">
          <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-[#4f58bb] to-[#4e9ceb] transition-all duration-1000 ease-in-out group-hover:w-full"></span>
          <a  href="/user/login" className="relative z-10  text-white">Ingresar</a>
        </button> 
      </nav>
    </header>
  );
}
export default PublicNav;   
