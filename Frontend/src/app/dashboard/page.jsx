"use client"

import { useState, useEffect } from "react"
import PrivateNav from "@/components/navs/PrivateNav"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileCheck,
  Clock,
  Calendar,
  Plus,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTotalApprentices } from "@/app/dashboard/apprentice/totalApprentices"

// Datos de ejemplo para permisos recientes
const recentPermissions = [
  { id: 1, apprentice: "Carlos Mendoza", program: "ADSO", date: "2025-04-16", status: "approved", avatar: "CM" },
  { id: 2, apprentice: "Laura Gómez", program: "Contabilidad", date: "2025-04-15", status: "pending", avatar: "LG" },
  { id: 3, apprentice: "Miguel Ángel", program: "Mecatrónica", date: "2025-04-14", status: "rejected", avatar: "MA" },
  { id: 4, apprentice: "Ana Martínez", program: "ADSO", date: "2025-04-13", status: "approved", avatar: "AM" },
]

export default function DashboardPage() {
  const titleAcudiente = "Acudiente"
  const { data: totalApprentices, isLoading: loadingApprentices } = useTotalApprentices()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPermissions, setFilteredPermissions] = useState(recentPermissions)
  const [activeTab, setActiveTab] = useState("overview")
  const isMobile = useIsMobile()

  const stats = {
    totalApprentices: totalApprentices ?? 0,
    activePermissions: 18,
    pendingApprovals: 7,
    permissionsToday: 4,
    permissionsThisWeek: 23,
    permissionsThisMonth: 86,
  }

  const MAX_APPRENTICES = 1300 // 100% = capacidad total
  const progressApprentices = Math.min(
    Math.round((stats.totalApprentices / MAX_APPRENTICES) * 100),
    100
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1)

  return (
    <PrivateNav titlespage="Contenido Principal">
      <div className="min-h-screen">
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-inner ${isMobile ? "mx-auto" : "ml-[60px]"}`}
        >
          {/* Encabezado del Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 drop-shadow-sm">Bienvenido a BIENESOFT</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {formattedDate} • Sistema de Gestión de Permisos
              </p>
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
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">
                      {loadingApprentices ? "..." : stats.totalApprentices}
                    </h3>
                    {/* Mostrar solo el porcentaje */}
                    {!loadingApprentices && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {progressApprentices}%
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-[#218EED]" />
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-3 sm:mt-4">
                  <Progress value={progressApprentices} className="h-1.5 bg-blue-100" />
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

          {/* Tabs de resumen */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-4 sm:space-y-6">
                  <Card className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">Resumen de Permisos</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Actividad de permisos reciente
                      </CardDescription>
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
      </div>
    </PrivateNav>
  )
}
