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

export default DashboardPage;
