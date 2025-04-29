import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle } from './components/Card';
import { Progress } from './components/Progress';
import { Button } from './components/Button';
import { Users, FileCheck, Clock } from 'lucide-react';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePermissions: 0,
    pendingPermissions: 0,
  });

  // Simula la carga de datos
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalUsers: 1500,
        activePermissions: 200,
        pendingPermissions: 50,
      });
      setLoading(false);
    }, 1000); // Simula un retardo en la carga
  }, []);

  // Progreso de estadísticas
  const progressUsers = Math.min(Math.round((stats.totalUsers / 2000) * 100), 100);
  const progressActivePermissions = Math.min(Math.round((stats.activePermissions / 300) * 100), 100);
  const progressPendingPermissions = Math.min(Math.round((stats.pendingPermissions / 100) * 100), 100);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {loading ? (
        <div className="text-center text-xl">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardTitle>Total Usuarios</CardTitle>
            <CardContent>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              <Progress value={progressUsers} />
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Permisos Activos</CardTitle>
            <CardContent>
              <h3 className="text-2xl font-bold">{stats.activePermissions}</h3>
              <Progress value={progressActivePermissions} />
            </CardContent>
          </Card>

          <Card>
            <CardTitle>Permisos Pendientes</CardTitle>
            <CardContent>
              <h3 className="text-2xl font-bold">{stats.pendingPermissions}</h3>
              <Progress value={progressPendingPermissions} />
            </CardContent>
          </Card>

          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center mt-6">
            <Button className="bg-blue-600 text-white flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-blue-700">
              <Users size={20} />
              Nuevo Permiso
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


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
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{progressApprentices}%</p>
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
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Permisos Activos</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">
                      {loadingSummary ? "..." : stats.activePermissions}
                    </h3>
                    {!loadingSummary && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{progressactivePermissions}%</p>
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
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Pendientes</p>
                    <h3 className="text-xl sm:text-2xl font-bold mt-1">
                      {loadingSummary ? "..." : stats.pendingApprovals}
                    </h3>
                    {!loadingSummary && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{progresspendientesPermissions}%</p>
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
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
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
                        label={({  percent }) => ` ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} permisos`, "Cantidad"]} />
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
                      <span className="font-semibold">{stats.permissionsToday}</span>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-5 h-5" />
                        <span>Esta semana</span>
                      </div>
                      <span className="font-semibold">{stats.permissionsThisWeek}</span>
                    </div>
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5" />
                        <span>Este mes</span>
                      </div>
                      <span className="font-semibold">{stats.permissionsThisMonth}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PrivateNav>
  )
}
export default DashboardPage;
