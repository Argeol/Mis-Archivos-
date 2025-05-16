"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  FileCheck,
  Clock,
  Plus,
  CalendarDays,
  Clock3,
  CalendarCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTotalApprentices } from "@/app/dashboard/apprentice/totalApprentices";
import { usePermissionSummary } from "@/app/dashboard/permissionGeneral/ResumenPermission";
import { useAuthUser } from "../user/login/useCurrentUser";
import LoadingPage from "@/components/utils/LoadingPage";

export default function DashboardPage() {
  const { data: totalApprentices, isLoading: loadingApprentices } =
    useTotalApprentices();
  const { data: permissionSummary, isLoading: loadingSummary } =
    usePermissionSummary();

  const { user, tip, isLoading: loadingUser, error: errorUser } = useAuthUser();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();

  useEffect(() => {
    // Solo quitamos loading general si todos cargan
    if (!loadingUser && !loadingApprentices && !loadingSummary) {
      setLoading(false);
    }
  }, [loadingUser, loadingApprentices, loadingSummary]);

  if (loading || loadingUser) return <LoadingPage />;

  if (errorUser) return <div>Error al cargar usuario: {errorUser.message}</div>;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700">
          No estás autenticado. Por favor inicia sesión.
        </p>
      </div>
    );
  }

  const stats = {
    totalApprentices: totalApprentices ?? 0,
    activePermissions: permissionSummary?.aprobadosActivos ?? 0,
    pendingApprovals: permissionSummary?.pendientes ?? 0,
    permissionsToday: permissionSummary?.permisosHoy ?? 0,
    permissionsThisWeek: permissionSummary?.permisosSemana ?? 0,
    permissionsThisMonth: permissionSummary?.permisosMes ?? 0,
  };

  const MAX_APPRENTICES = 1300; // 100% = capacidad total
  const progressApprentices = Math.min(
    Math.round((stats.totalApprentices / MAX_APPRENTICES) * 100),
    100
  );
  const CAN_ACTIVOS = 320;
  const progressactivePermissions = Math.min(
    Math.round((stats.activePermissions / CAN_ACTIVOS) * 100),
    100
  );
  const CAN_PENDIENTES = 320;
  const progresspendientesPermissions = Math.min(
    Math.round((stats.pendingApprovals / CAN_PENDIENTES) * 100),
    100
  );

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDate =
    currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <PrivateNav titlespage="Contenido Principal">
      <div className="min-h-screen">
        <main
          className={`flex-1 overflow-y-auto p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-inner ${
            isMobile ? "mx-auto" : "ml-[60px]"
          }`}
        >
          {/* Encabezado del Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
            
                <div className="mt-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 drop-shadow-sm">
                    Bienvenido a BIENESOFT, {user?.first_Name_Apprentice || user?.nom_Responsible}{" "}
                    {user?.last_Name_Apprentice || user?.ape_Responsible} ({tip})
                  </h1>
                </div>

              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {formattedDate} • Sistema de Gestión de Permisos
              </p>
            </div>

            {(tip === "Administrador" || tip === "Aprendiz") && (
              <div className="mt-4 md:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
                <Link href="/dashboard/permissionGeneral" passHref>
                  <Button
                    size="sm"
                    className="bg-[#218EED] hover:bg-[#1a70bd] flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <Plus size={16} />
                    <p>Nuevo Permiso</p>
                  </Button>
                </Link>
              </div>
            )}

            {tip === "Responsable" && (
              <Button
                size="sm"
                className="bg-[#218EED] hover:bg-[#1a70bd] flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
              >
                <p>Permisos Pendientes</p>
              </Button>
            )}
          </div>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6">
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Total Aprendices
                    </p>
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
                  <Progress
                    value={progressApprentices}
                    className="h-1.5 bg-blue-100 "
                    indicatorClassName="bg-[#218EED]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Permisos Activos
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">
                      {loadingSummary ? "..." : stats.activePermissions}
                    </h3>
                    {!loadingSummary && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {progressactivePermissions}%
                      </p>
                    )}
                  </div>
                  <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                    <FileCheck className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <Progress
                    value={progressactivePermissions}
                    className="h-1.5 bg-blue-100"
                    indicatorClassName=" bg-green-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">
                      Pendientes
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">
                      {loadingSummary ? "..." : stats.pendingApprovals}
                    </h3>
                    {!loadingSummary && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {progresspendientesPermissions}%
                      </p>
                    )}
                  </div>
                  <div className="bg-amber-100 p-2 sm:p-3 rounded-full">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600" />
                  </div>
                </div>

                <div className="mt-3 sm:mt-4">
                  <Progress
                    value={progresspendientesPermissions}
                    className="h-1.5 bg-blue-100"
                    indicatorClassName="bg-amber-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs de resumen */}
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico Simplificado */}
                {/* <Card className="p-4">
                  <CardTitle className="text-lg mb-4">Actividad de Permisos Solicitados</CardTitle>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({  percent }) =>  ${(percent * 100).toFixed(0)}%}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={cell-${index}} fill={COLORS[index % COLORS.length]}/>
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [${value} permisos, "Cantidad"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card> */}

                {/* Resumen con íconos */}
                <Card className="p-4 space-y-4">
                  <CardTitle className="text-lg">Resumen de Permisos</CardTitle>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" />
                        <span>Diligenciados hoy</span>
                      </div>
                      <span className="font-semibold">
                        {stats.permissionsToday}
                      </span>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-5 h-5" />
                        <span>Esta semana</span>
                      </div>
                      <span className="font-semibold">
                        {stats.permissionsThisWeek}
                      </span>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5" />
                        <span>Este mes</span>
                      </div>
                      <span className="font-semibold">
                        {stats.permissionsThisMonth}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          {/* Tarjetas de estadísticas */}
          {/* ... (el resto del código sigue igual) */}
        </main>
      </div>
    </PrivateNav>
  );
}
