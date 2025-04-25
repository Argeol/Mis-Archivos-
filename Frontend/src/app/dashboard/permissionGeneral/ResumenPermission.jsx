import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"

const fetchPermissionSummary = async () => {
  const { data } = await axiosInstance.get("/api/permission/resumen") // Ajusta esta URL si es necesario
  return {
    pendientes: data.pendientes,
    aprobadosActivos: data.aprobadosActivos
  }
}

export const usePermissionSummary = () => {
  return useQuery({
    queryKey: ["permissionSummary"],
    queryFn: fetchPermissionSummary,
  })
}
