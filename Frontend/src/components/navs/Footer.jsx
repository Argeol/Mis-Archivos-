import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-sky-100 text-sky-800 py-8">
      <div className="container px-4 md:px-6 mx-auto text-center">
        {/* Section 1: About */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight">Bienesoft</h3>
          <p className="text-sm">
            Simplificando la gestión de permisos para aprendices del centro Agropecuario "La Granja".
          </p>
        </div>

        {/* Footer bottom */}
        <div className="mt-6 pt-6 border-t border-sky-200">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Bienesoft. Todos los derechos reservados.
          </p>
          <div className="mt-2 space-x-4 text-xs">
            <Link href="/privacidad" className="hover:underline text-sky-600">
              Política de privacidad
            </Link>
            <Link href="/terminos" className="hover:underline text-sky-600">
              Términos de servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
