
namespace bienesoft.Models
{

    public class apprenticeDTO
    {

        public string First_Name_Apprentice { get; set; } = string.Empty;
        public string Last_Name_Apprentice { get; set; } = string.Empty;
        public DateTime Birth_Date_Apprentice { get; set; }
        public string Gender_Apprentice { get; set; } = string.Empty;
        public string Email_Apprentice { get; set; } = string.Empty;
        public string Address_Apprentice { get; set; } = string.Empty;
        public string Address_Type_Apprentice { get; set; } = string.Empty;
        public string Phone_Apprentice { get; set; } = string.Empty;
        public string Status_Apprentice { get; set; } = "Active";
        public int Permission_Count_Apprentice { get; set; }
        public string MunicipalityName { get; set; }
        public string ProgramName { get; set; }
        public string AreaName { get; set; }
        public string nom_department { get; set; }

    }

    public class ApprenticeCreateDTO
    {
        public string First_Name_Apprentice { get; set; } = string.Empty;
        public string Last_Name_Apprentice { get; set; } = string.Empty;
        public DateTime Birth_Date_Apprentice { get; set; }
        public string Gender_Apprentice { get; set; } = string.Empty;
        public string Email_Apprentice { get; set; } = string.Empty;
        public string Address_Apprentice { get; set; } = string.Empty;
        public string Address_Type_Apprentice { get; set; } = string.Empty;
        public string Phone_Apprentice { get; set; } = string.Empty;
        public string Status_Apprentice { get; set; } = "Active";
        public int Permission_Count_Apprentice { get; set; }
        public string Tip_Apprentice { get; set; } = string.Empty;

        public int Attendant_Id {get; set;}


        // Claves foráneas, solo IDs
        public int File_id { get; set; }
        public int Municipality_Id { get; set; }
    }
    public class ApprenticeUpdateDTO
    {
        public string? First_Name_Apprentice { get; set; }
        public string? Last_Name_Apprentice { get; set; }
        public DateTime? Birth_Date_Apprentice { get; set; }
        public string? Gender_Apprentice { get; set; }
        public string? Email_Apprentice { get; set; }
        public string? Address_Apprentice { get; set; }
        public string? Address_Type_Apprentice { get; set; }
        public string? Phone_Apprentice { get; set; }
        public string? Status_Apprentice { get; set; }
        public int? MunicipalityId { get; set; } // Esto permite actualizar solo el municipio si es necesario
        public int? Id_Municipality { get; set; }
    }

}
