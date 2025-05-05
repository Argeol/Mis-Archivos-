import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { useAuthUser } from './useCurrentUser';

const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');
  const user = useAuthUser();

  if (!token) {
    throw new Error('Token no encontrado');
  }

  const decoded = jwtDecode(token);

  let url = '';
  if (user.role === "Aprendiz") {
    url = '/api/Apprentice/GetApprenticeById';
  } else if (user.role === 'Responsable') {
    url = '/api/Responsible/GetResponsibleID';
  } else {
    throw new Error('Rol de usuario desconocido');
  }

  const response = await axiosInstance.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useUserInfo = (role, token) => {
  return useQuery({
    queryKey: ['userInfo', role],
    queryFn: () => fetchUserInfo(role, token),
    enabled: !!role && !!token,
  });
};
