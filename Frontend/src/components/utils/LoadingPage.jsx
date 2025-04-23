"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingPage() {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Iniciando")
  const [showContent, setShowContent] = useState(true)

  // Cambiar el texto de carga
  useEffect(() => {
    const texts = ["Iniciando", "Cargando datos", "Preparando interfaz", "Casi listo"]
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length
      setLoadingText(texts[currentIndex])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Ocultar después de completar
  useEffect(() => {
    if (loadingProgress === 100) {
      const timeout = setTimeout(() => {
        setShowContent(false)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [loadingProgress])

  return (
    <AnimatePresence>
      {showContent && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 via-indigo-50 to-blue-50 z-50"
        >
          <div className="flex flex-col items-center justify-center max-w-md w-full px-4">
            <div className="relative mb-8">
              {/* Logo con animación */}
              <motion.div
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="relative w-32 h-32 mx-auto"
              >
                <img
                  src="../assets/img/bienesoft.webp"
                  alt="BIENESOFT Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              {/* Órbita animada */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: -1 }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-400/50" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-400/50" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full shadow-lg shadow-cyan-400/50" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-sky-500 rounded-full shadow-lg shadow-sky-400/50" />
              </motion.div>
            </div>

            {/* Texto de carga con animación */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="text-center mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">BIENESOFT</h2>
              <p className="text-gray-600">{"Cargando"}...</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
