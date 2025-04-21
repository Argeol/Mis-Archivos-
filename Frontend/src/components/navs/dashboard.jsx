"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Search,
  Plus,
  RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "./useIsMobile" // Asumiendo que tienes este hook

// Datos de ejemplo - En producción, estos vendrían de tu API/base de datos
const recentPermissions = [
  { id: 1, apprentice: "Carlos Mendoza", program: "ADSO", date: "2025-04-16", status: "approved", avatar: "CM" },
  { id: 2, apprentice: "Laura Gómez", program: "Contabilidad", date: "2025-04-15", status: "pending", avatar: "LG" },
  { id: 3, apprentice: "Miguel Ángel", program: "Mecatrónica", date: "2025-04-14", status: "rejected", avatar: "MA" },
  { id: 4, apprentice: "Ana Martínez", program: "ADSO", date: "2025-04-13", status: "approved", avatar: "AM" },
]


const stats = {
  totalApprentices: 245,
  activePermissions: 18,
  pendingApprovals: 7,
  programsWithPermissions: 5,
  permissionsToday: 4,
  permissionsThisWeek: 23,
  permissionsThisMonth: 86,
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPermissions, setFilteredPermissions] = useState(recentPermissions)
  const [activeTab, setActiveTab] = useState("overview")
  const isMobile = useIsMobile()

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filtrar permisos basados en la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPermissions(recentPermissions)
    } else {
      const filtered = recentPermissions.filter(
        (permission) =>
          permission.apprentice.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.program.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredPermissions(filtered)
    }
  }, [searchQuery])

  // Obtener la fecha actual en formato legible
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Capitalizar primera letra
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1)

  return (
    <main
      className={`flex-1 overflow-y-auto p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-inner ${isMobile ? "mx-auto" : "ml-[60px]"}`}
    >
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 drop-shadow-sm">Bienvenido a BIENESOFT</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{formattedDate} • Sistema de Gestión de Permisos</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
          <Button
            size="sm"
            className="bg-[#218EED] hover:bg-[#1a70bd] flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>Nuevo Permiso</span>  
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Aprendices</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{stats.totalApprentices}</h3>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-[#218EED]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={85} className="h-1.5 bg-blue-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Permisos Activos</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{stats.activePermissions}</h3>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <FileCheck className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={45} className="h-1.5 bg-green-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pendientes</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{stats.pendingApprovals}</h3>
              </div>
              <div className="bg-amber-100 p-2 sm:p-3 rounded-full">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={30} className="h-1.5 bg-amber-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal con pestañas */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Resumen de Permisos</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Actividad de permisos reciente</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-xs sm:text-sm">Hoy</span>
                      </div>
                      <span className="font-medium text-sm">{stats.permissionsToday}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-xs sm:text-sm">Esta semana</span>
                      </div>
                      <span className="font-medium text-sm">{stats.permissionsThisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-xs sm:text-sm">Este mes</span>
                      </div>
                      <span className="font-medium text-sm">{stats.permissionsThisMonth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      
    </main>
  )
}
