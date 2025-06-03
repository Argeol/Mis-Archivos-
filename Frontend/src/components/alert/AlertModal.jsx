"use client"

import { useEffect, useState, useCallback } from "react"
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react"

export default function AlertModal({
  type = "success",
  message = "",
  onClose,
  isOpen = false,
  autoCloseInMs = 0,
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) setIsVisible(true)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && autoCloseInMs) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoCloseInMs)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoCloseInMs])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    if (onClose) onClose()
  }, [onClose])

  if (!isOpen && !isVisible) return null

  const alertConfig = {
    success: {
      icon: CheckCircle,
      title: "¡Operación Exitosa!",
      colors: {
        primary: "#10b981",
        secondary: "#d1fae5",
        border: "#6ee7b7",
        text: "#065f46",
        shadow: "rgba(16, 185, 129, 0.6)",
      },
    },
    error: {
      icon: XCircle,
      title: "Error",
      colors: {
        primary: "#ef4444",
        secondary: "#fee2e2",
        border: "#fca5a5",
        text: "#b91c1c",
        shadow: "rgba(239, 68, 68, 0.6)",
      },
    },
    warning: {
      icon: AlertCircle,
      title: "Advertencia",
      colors: {
        primary: "#f59e0b",
        secondary: "#fef3c7",
        border: "#fcd34d",
        text: "#92400e",
        shadow: "rgba(245, 158, 11, 0.6)",
      },
    },
    info: {
      icon: Info,
      title: "Información",
      colors: {
        primary: "#3b82f6",
        secondary: "#dbeafe",
        border: "#93c5fd",
        text: "#1e40af",
        shadow: "rgba(59, 130, 246, 0.6)",
      },
    },
  }

  const config = alertConfig[type] || alertConfig.success
  const IconComponent = config.icon

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        onClick={handleClose}
      />

      <div
        className={`relative z-10 bg-white rounded-2xl overflow-hidden w-full max-w-md mx-auto transition-all duration-500 ${
          isVisible ? "scale-100 rotate-0" : "scale-95 rotate-3"
        }`}
        style={{
          boxShadow: `0 10px 25px -5px ${config.colors.shadow}, 0 8px 10px -6px ${config.colors.shadow}`,
          border: `2px solid ${config.colors.border}`,
          transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(20px) rotateX(-10deg)",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{
            background: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.border})`,
          }}
        />

        <div
          className="absolute top-0 right-0 w-16 h-16 -mt-8 -mr-8 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${config.colors.primary} 0%, transparent 70%)`,
          }}
        />

        <div
          className="absolute bottom-0 left-0 w-24 h-24 -mb-12 -ml-12 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${config.colors.primary} 0%, transparent 70%)`,
          }}
        />

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div
          className="pt-6 px-6 pb-4 flex items-center"
          style={{
            background: `linear-gradient(135deg, ${config.colors.secondary}, ${config.colors.border})`,
          }}
        >
          <div className="mr-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.text})`,
              }}
            >
              <IconComponent className="h-7 w-7" />
            </div>
          </div>
          <h2 className="text-xl font-bold" style={{ color: config.colors.text }}>
            {config.title}
          </h2>
        </div>

        <div className="px-6 py-5 relative overflow-hidden bg-white min-h-[80px]">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(${config.colors.primary} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
          <p className="text-center font-medium relative z-10" style={{ color: config.colors.text }}>
            {message}
          </p>
        </div>

        <div className="p-4 bg-gray-50">
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{
              background: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.text})`,
              boxShadow: `0 4px 6px -1px ${config.colors.shadow}`,
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
