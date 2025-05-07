  import { useQuery } from '@tanstack/react-query';
  import axiosInstance from '@/lib/axiosInstance';
  import { useAuthUser } from './useCurrentUser';
  import ContactPage from '@/components/navs/contact';

  const fetchUserInfo = async (role, token) => {
    let url = '';
    let translations = {};
    let ignorar =[];

    if (role === "Aprendiz") {
      url = '/api/Apprentice/GetApprenticeById';

      translations = {
        id_Apprentice: "Numero de Documento",
        first_Name_Apprentice: "Nombres",
        last_Name_Apprentice: "Apellidos",
        address_Type_Apprentice: "Localidad",
        address_Apprentice: "Nombre de Localidad",
        email_Apprentice: "Correo electronico",
        birth_Date_Apprentice_Formatted: "Fecha de Nacimiento",
        phone_Apprentice: "Numero Telefonico",
        gender_Apprentice:"Genero",
        tip_Apprentice:"Tipo de Aprendiz",
        nom_responsible: "Nombres de Responsable",
        ape_responsible: "Apellidos de Responsable",
        email_responsible: "Correo de Responsable",
        tel_responsible: "Telefono de Responsable",
        municipalityName: "Municipio de Recidencia",
        departmentName: "Departamento de Recidencia",
        file_Id: "Codigo de Ficha",
        programName: "Programa de Formacion",
        areaName: "Area",
        status_Apprentice: "Estado de Aprendiz",
      };

      ignorar=["id_municipality"]

    } else if (role === 'Responsable') {
      url = '/api/Responsible/GetResponsibleID';

      translations = {
        responsible_Id: "Numero de Documento",
        nom_Responsible: "Nombres",
        ape_Responsible: "Apellidos",
        tel_Responsible: "Numero de Telefonico",
        name_role: "Rol",
        state: "Estado",
        email_Responsible:"Correo electronico",
      }
    } else {
      throw new Error('Rol de usuario desconocido');
    }

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const filteredData = Object.fromEntries(
      Object.entries(response.data).filter(([key]) => !ignorar.includes(key))
    );

    return {data: filteredData, translations};
    
  };

  export const useUserInfo = () => {
    const user = useAuthUser();
    const token = localStorage.getItem('token');

    return useQuery({
      queryKey: ['userInfo', user?.role],
      queryFn: () => fetchUserInfo(user.role, token),
      enabled: !!user?.role && !!token,
    });
  };


