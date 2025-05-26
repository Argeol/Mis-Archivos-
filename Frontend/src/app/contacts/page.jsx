'use client';

import Footer from "@/components/navs/Footer";
import PublicNav from "@/components/navs/PublicNav";
import ContactPage from "@/app/contacts/contact"; // Asegúrate de importar el componente ContactPage correctamente

export default function Contact() {
  return (
    <>
      <PublicNav />
      <ContactPage /> {/* Aquí renderizamos el componente ContactPage */}
      <Footer/>
    </>
  );
}
