import Link from "next/link"
import Image from "next/image"
import { BadgeCheck , ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-50 to-slate-100 border-t border-gray-200 text-slate-800 py-4 relative overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4 text-center relative">
        {/* Logo y nombre */}
        <div className="flex items-center justify-center  transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <Image
              src="/assets/img/bienesoft.webp"
              alt="Logo Bienesoft"
              width={90}
              height={85}
              className="drop-shadow-sm"
            />
          </div>
          <h3 className="text-2xl font-bold tracking-tight -ml-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-transparent bg-clip-text">
            BIENESOFT
          </h3>
        </div>

        {/* Eslogan */}
        <p className="text-sm md:text-base max-w-md mx-auto mb-3 text-slate-600 leading-relaxed">
          Con un solo clic, automatiza tus permisos y olvídate del papeleo.
          <span className="text-sky-600 font-medium"> Bienesoft lo hace por ti.</span>
        </p>

        {/* Línea decorativa */}
        <div className="flex items-center justify-center mb-3">
          <div className="h-px w-16 bg-slate-300"></div>
          <BadgeCheck className="h-4 w-4 mx-2 text-sky-500" />
          <div className="h-px w-16 bg-slate-300"></div>
        </div>

        {/* Footer bottom */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Bienesoft. Todos los derechos reservados.
          </p>
          <div className="mt-3 space-x-4 text-xs flex justify-center items-center">
            <Link
              href="https://www.sena.edu.co/es-co/transparencia/documents/proteccion_datos_personales_sena_2016.pdf"
              className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors duration-300 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3 mr-1 group-hover:animate-pulse" />
              Política de privacidad
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600 mt-0.5"></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
