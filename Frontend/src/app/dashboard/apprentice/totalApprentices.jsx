import { useQuery } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"

const fetchTotalApprentices = async () => {
  const {data} = await axiosInstance.get("api/Apprentice/CountApprentices")
  return data?.totalAprendices
}

export const useTotalApprentices = () => {
  return useQuery({
    queryKey: ["totalApprentices"],
    queryFn: fetchTotalApprentices,
  })
}
