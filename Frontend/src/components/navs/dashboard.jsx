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
          <Button variant="outline" size="sm" className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto">
            <RefreshCw size={16} />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
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

        <Card className="overflow-hidden">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">Programas</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{stats.programsWithPermissions}</h3>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Progress value={60} className="h-1.5 bg-purple-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal con pestañas */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4 w-full sm:w-auto overflow-x-auto flex-nowrap">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Vista General
          </TabsTrigger>
          <TabsTrigger value="permissions" className="text-xs sm:text-sm">
            Permisos Recientes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">
            Análisis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Actividad reciente */}
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-lg">Permisos Recientes</CardTitle>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Buscar permisos..."
                      className="pl-8 h-9 text-sm w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Últimos permisos solicitados por los aprendices
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`/avatars/${permission.id}.png`} />
                            <AvatarFallback className="bg-[#218EED] text-white text-xs">
                              {permission.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{permission.apprentice}</p>
                            <p className="text-xs text-gray-500">{permission.program}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                          <p className="text-xs text-gray-500">
                            {new Date(permission.date).toLocaleDateString("es-ES")}
                          </p>
                          <Badge
                            className={`text-xs ${
                              permission.status === "approved"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : permission.status === "pending"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {permission.status === "approved"
                              ? "Aprobado"
                              : permission.status === "pending"
                                ? "Pendiente"
                                : "Rechazado"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">No se encontraron permisos</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                    Ver todos los permisos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resumen y acciones rápidas */}
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

              <Card className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Accesos directos a funciones comunes</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-1 sm:gap-2"
                    >
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-[10px] sm:text-xs">Aprendices</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-1 sm:gap-2"
                    >
                      <FileCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-[10px] sm:text-xs">Permisos</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-1 sm:gap-2"
                    >
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-[10px] sm:text-xs">Pendientes</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-1 sm:gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-[10px] sm:text-xs">Aprobados</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Listado de Permisos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Gestiona todos los permisos de los aprendices
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-center py-10 text-gray-500 text-sm">
                Aquí se mostrará el listado completo de permisos con opciones de filtrado y búsqueda avanzada.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Análisis de Permisos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Estadísticas y tendencias de permisos por programa, fecha y estado
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-center py-10 text-gray-500 text-sm">
                Aquí se mostrarán gráficos y estadísticas detalladas sobre los permisos.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pie de página */}
      <footer className="mt-8 text-center text-xs text-gray-500">
        <p>© 2025 BIENESOFT - Sistema de Gestión de Permisos de Aprendices</p>
      </footer>
    </main>
  )
}
