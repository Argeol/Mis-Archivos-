"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaListAlt,
  FaFileAlt,
  FaUserFriends,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import LoadingPage from "../utils/LoadingPage";

function PublicNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    {
      href: "/aboutUs",
      icon: <FaListAlt className="text-[#218EED]" />,
      text: "¿Quiénes Somos?",
    },
    {
      href: "/contacts",
      icon: <FaUserFriends className="text-[#218EED]" />,
      text: "Contacto",
    },
    {
      href: "/documentation",
      icon: <FaFileAlt className="text-[#218EED]" />,
      text: "Documentos",
    },
  ];
  // if (loading) return <LoadingPage />;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        px-4 lg:px-6 h-16 border-b flex items-center justify-between shadow-sm
        ${isScrolled ? "bg-transparent backdrop-blur-md" : "bg-slate-100"}`}
      >
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-10">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              href={link.href}
            >
              {link.icon}
              {link.text}
            </Link>
          ))}

          <button className="btn relative w-24 h-9 rounded-2xl text-sm font-inherit cursor-pointer overflow-hidden shadow-[10px_2px_25px_#91a0b9,10px_6px_2px_#91a0b9] bg-[#218EED] border-none flex items-center justify-center group">
            <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-[#4f58bb] to-[#4e9ceb] transition-all duration-1000 ease-in-out group-hover:w-full"></span>
            <a href="/user/login" className="relative z-10 text-white">
              Ingresar
            </a>
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-[#218EED] text-2xl focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 w-full bg-white shadow-lg z-40 md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors py-2 border-b border-gray-100"
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.text}
                </Link>
              ))}

              <div className="pt-2">
                <button className="btn relative w-full h-10 rounded-2xl text-sm font-inherit cursor-pointer overflow-hidden shadow-[10px_2px_25px_#91a0b9,10px_6px_2px_#91a0b9] bg-[#218EED] border-none flex items-center justify-center group">
                  <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-[#4f58bb] to-[#4e9ceb] transition-all duration-1000 ease-in-out group-hover:w-full"></span>
                  <a href="/user/login" className="relative z-10 text-white">
                    Ingresar
                  </a>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PublicNav;
