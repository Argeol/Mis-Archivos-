'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { FaMapMarkerAlt,FaWhatsapp } from 'react-icons/fa'


const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-4xl md:text-6xl font-serif text-center mb-8">
        Contáctanos
      </h1>

      <motion.p
        className="text-xl text-center text-gray-700 mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Estamos aquí para ayudarte. No dudes en ponerte en contacto con nosotros a través de cualquiera de los siguientes medios.
      </motion.p>

      <div className="flex justify-center">
        <img src="/assets/img/mapa.png" alt="Mapa del centro" className="rounded-lg shadow-lg max-w-[500px] mx-auto" />
      </div>

      <section className="flex justify-center items-center gap-8 mb-12 mt-12">
        <motion.div
          className="flex gap-6 justify-center w-full sm:w-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <ContactCard
            icon={<Phone className="w-6 h-6 text-blue-500" />}
            title="Teléfono"
            content="+57 3102023477"
            link="tel:+573102023477"
          />
          <ContactCard
            icon={<Mail className="w-6 h-6 text-red-500" />}
            title="Correo"
            content="bienesoft5@gmail.com"
            link="mailto:bienesoft5@gmail.com"
            isEmail={true}
          />
          <ContactCard
            icon={<FaWhatsapp className="w-6 h-6 text-[#4AE05A]" />}
            title="WhatsApp"
            content="+57 3001573906"
            link="https://wa.me/573001573906"
          />
          <ContactCard
            icon={<FaMapMarkerAlt className="w-6 h-6 text-red-500" />}
            title="Dirección"
            content="Km 5, Espinal - Ibague, Tolima"
            link="https://www.google.com/maps?q=Km+2,+Chicoral+-+Espinal,+Chicoral,+Tolima"
          />
          <ContactCard
            icon={<FaMapMarkerAlt className="w-6 h-6 text-purple-500" />}
            title="Blog SENA"
            content="Blog SENA"
            link="http://senalagranja.blogspot.com/"
          />
        </motion.div>
      </section>
    </div>
  )
}

const ContactCard = ({ icon, title, content, link, isEmail }) => (
  <motion.div
    className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between space-x-4 w-[160px] sm:w-[180px] md:w-[200px]"
    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="flex items-center space-x-4">
      {icon}
      <div className="flex flex-col w-full">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {/* Si es un correo, lo mostramos con un formato especial y sigue funcionando como link */}
        {isEmail ? (
          <a
            href={link}
            className="text-xs text-gray-600 hover:text-blue-500"
            aria-label={title}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>{content.split('@')[0]}</div> {/* Parte antes de "@" */}
            <div>@{content.split('@')[1]}</div> {/* Parte después de "@" */}
          </a>
        ) : (
          <a
            href={link}
            className="text-xs text-gray-600 hover:text-blue-500"
            aria-label={title}
            target="_blank" // Abre el enlace en una nueva pestaña
            rel="noopener noreferrer" // Medida de seguridad recomendada
          >
            {content}
          </a>
        )}
      </div>
    </div>
  </motion.div>
)

export default ContactPage
