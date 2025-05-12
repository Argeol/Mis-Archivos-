import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchUserData = async () => {
  const response = await axiosInstance.get("/api/User/Me", {
    withCredentials: true,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("No se pudo obtener los datos del usuario.");
  }
};

export const useAuthUser = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["userData"], // ahora se usa así
    queryFn: fetchUserData,
    retry: false, // opcional: no reintenta si falla
  });

  return {
    userData: data,
    loading: isLoading,
    error: error ? error.message : null,
  };
};
