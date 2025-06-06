"use client";

import { useState, useEffect } from "react";
import PrivateNav from "@/components/navs/PrivateNav";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileCheck,
  Clock,
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
import { PendingPermissionsList } from "./permissionGeneral/ResponsiblePermissionsList";
import ApprenticePermissionList from "./permissionGeneral/ApprenticePermissionList";
import ModalDialog from "@/components/utils/ModalDialog";
import RegisterPermission from "./permissionGeneral/RegisterPermission";
import RegisterPermissionFS from "./permissionFS/RegisterPermissionFS";
import axiosInstance from "@/lib/axiosInstance";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function DashboardPage() {
  // Todos los hooks deben llamarse siempre en el mismo orden
  const { data: totalApprentices, isLoading: loadingApprentices } =
    useTotalApprentices();
  const { data: permissionSummary, isLoading: loadingSummary } =
    usePermissionSummary();
  const { user, tip, isLoading: loadingUser, error: errorUser } = useAuthUser();
  const isMobile = useIsMobile();

  // Estados locales
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activo, setActivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // useEffect para el loading general
  useEffect(() => {
    if (!loadingUser && !loadingApprentices && !loadingSummary) {
      setLoading(false);
    }
  }, [loadingUser, loadingApprentices, loadingSummary]);

  // useEffect para obtener el estado del permiso FS
  useEffect(() => {
    const obtenerEstadoPermisoFS = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/PermissionFS/consulta-estado-permisoFS"
        );
        console.log("Respuesta del GET:", res.data);
        setActivo(res.data?.activo ?? false);
      } catch (error) {
        console.error("Error al obtener el estado del permiso FS", error);
        setActivo(false);
      }
    };

    if (tip === "Administrador") {
      obtenerEstadoPermisoFS();
    }
  }, [tip]);

  // Función para manejar el cambio de estado del permiso FS
  const manejarCambio = async () => {
    setCargando(true);
    setMensaje("");

    try {
      const nuevoEstado = !activo;
      const payload3 = nuevoEstado.toString(); // solo el stringn

      console.log("Estado actual:", activo);
      console.log("Nuevo estado:", nuevoEstado);

      let response;
      try {
        // Tercer intento: solo el string
        response = await axiosInstance.post(
          "/api/PermissionFS/cambia-estado-permisoFS",
          payload3,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ Éxito con payload3 (solo string)");
      } catch (error3) {
        console.log(
          "❌ Falló payload3, intentando payload4 (solo boolean):",
          payload4
        );
      }

      console.log("Respuesta del POST:", response.data);

      // Actualizar el estado local
      setActivo(nuevoEstado);
      setMensaje(
        `Permiso FS ${nuevoEstado ? "activado" : "desactivado"} correctamente.`
      );
    } catch (error) {
      console.error("Error al cambiar el estado del permiso FS:", error);

      // Mostrar más detalles del error
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        // Mostrar el mensaje de error específico si está disponible
        const errorMessage = error.response.data?.errors
          ? Object.values(error.response.data.errors).flat().join(", ")
          : error.response.data?.title || "Error desconocido";

        setMensaje(`Error: ${errorMessage}`);
      } else {
        setMensaje("Ocurrió un error al cambiar el estado.");
      }

      // En caso de error, volver a obtener el estado actual
      try {
        const res = await axiosInstance.get(
          "/api/PermissionFS/consulta-estado-permisoFS"
        );
        setActivo(res.data?.activo ?? false);
      } catch (getError) {
        console.error("Error al recargar el estado:", getError);
      }
    } finally {
      setCargando(false);
      setTimeout(() => setMensaje(""), 5000); // Aumenté el tiempo para leer el error
    }
  };

  // Renderizado condicional para loading y errores
  if (loading || loadingUser) return <LoadingPage />;

  if (errorUser) return <div>Error al cargar usuario: {errorUser.message}</div>;

  // Cálculo de estadísticas
  const stats = {
    totalApprentices: totalApprentices ?? 0,
    activePermissions: permissionSummary?.aprobadosActivos ?? 0,
    pendingApprovals: permissionSummary?.pendientes ?? 0,
    permissionsToday: permissionSummary?.permisosHoy ?? 0,
    permissionsThisWeek: permissionSummary?.permisosSemana ?? 0,
    permissionsThisMonth: permissionSummary?.permisosMes ?? 0,
  };

  const MAX_APPRENTICES = 1300;
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
          className={`flex-1 overflow-y-auto p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-t-2xl shadow-inner ${isMobile ? "mx-auto" : "ml-[60px]"
            }`}
        >
          {tip === "Aprendiz" && (
            <div className="flex justify-center items-center mt-10">
              <img
                src="assets/img/bienesoft.webp"
                title="BIENESOFT"
                className="w-20 h-20 object-contain animate-bounce"
              />
            </div>
          )}

          {/* Encabezado del Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <div className="mt-20">
                <h1 className="ml-20 -mt-[55] text-2xl sm:text-3xl font-extrabold text-gray-800 drop-shadow-sm">
                  Bienvenido,{" "}
                  {user?.first_Name_Apprentice || user?.nom_Responsible}{" "}
                  {user?.last_Name_Apprentice || user?.ape_Responsible} ({tip})
                </h1>
              </div>

              <p className="ml-20 text-sm sm:text-base text-gray-600 mt-1">
                {formattedDate} • Sistema de Gestión de Permisos
              </p>
            </div>

            {(tip === "Administrador" || tip === "Aprendiz") && (
              <ModalDialog
                TitlePage="Permiso"
                RegisterComponets={RegisterPermission}
              />
            )}
          </div>
          <div className="p-6">
            {tip === "Responsable" && (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Permisos Pendientes
                </h2>
                <PendingPermissionsList />
              </>
            )}
          </div>
          <div className="p-6 ml-12">
            {tip === "Aprendiz" && (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Permisos Pendientes
                </h2>
                <ApprenticePermissionList />
              </>
            )}
          </div>

          {/* Sección para Responsables */}
          {tip === "Responsable" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Permisos Pendientes
              </h2>
              <PendingPermissionsList />
            </div>
          )}

          {/* Sección para Aprendices */}
          {tip === "Aprendiz" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Permisos Pendientes
              </h2>
              <ApprenticePermissionList />
            </div>
          )}
          {/* Sección para Administradores */}
          {tip === "Administrador" && (
            <>
              {/* Control de Permisos FS */}

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
                    <div className="mt-3 sm:mt-4">
                      <Progress
                        value={progressApprentices}
                        className="h-1.5 bg-blue-100"
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
                        indicatorClassName="bg-green-600"
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
                <Card className="mb-6 w-full">
                  <CardContent className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg mb-3 sm:mb-4">
                      Control de Permisos Internos
                    </CardTitle>

                    {/* Layout responsive: vertical en móvil, horizontal en desktop */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <Label
                            htmlFor="permiso-fs"
                            className="text-sm sm:text-base font-medium whitespace-nowrap"
                          >
                            Permiso
                          </Label>
                          <Badge
                            variant={
                              activo === null
                                ? "outline"
                                : activo
                                ? "default"
                                : "destructive"
                            }
                            className={`text-xs sm:text-sm w-fit ${
                              activo === null
                                ? "bg-gray-100 text-gray-600"
                                : activo
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-red-100 text-red-700 border-red-300"
                            }`}
                          >
                            {activo === null
                              ? "Cargando..."
                              : activo
                              ? "Activado"
                              : "Desactivado"}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {activo === null
                            ? "Verificando estado..."
                            : activo
                            ? "Permiso habilitado globalmente"
                            : "El permiso está deshabilitado"}
                        </p>
                      </div>

                      {/* Switch alineado a la derecha en desktop, centrado en móvil */}
                      <div className="flex justify-center sm:justify-end">
                        <Switch
                          id="permiso-fs"
                          checked={activo === true}
                          onCheckedChange={manejarCambio}
                          disabled={cargando || activo === null}
                          className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                        />
                      </div>
                    </div>

                    {mensaje && (
                      <div
                        className={`mt-3 sm:mt-4 p-3 rounded-lg text-xs sm:text-sm transition-all ${
                          mensaje.includes("Error") || mensaje.includes("error")
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                        }`}
                      >
                        {mensaje}
                      </div>
                    )}
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
                    <Card className="p-4 space-y-4">
                      <CardTitle className="text-lg">
                        Resumen de Permisos
                      </CardTitle>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5" />
                            <span>Diligenciados hoy</span>
                          </div>
                          <span className="font-semibold">
                            {stats.permissionsToday}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock3 className="w-5 h-5" />
                            <span>Esta semana</span>
                          </div>
                          <span className="font-semibold">
                            {stats.permissionsThisWeek}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
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
            </>
          )}
        </main>
      </div>
    </PrivateNav>
  );
}
