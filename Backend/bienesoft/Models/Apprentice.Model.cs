using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using bienesoft.Models;
namespace bienesoft.Models
{
    public class Apprentice
    {
        [Key]
        public int Id_Apprentice { get; set; }
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
        public int Id_Municipality { get; set; }
        public int File_Id { get; set; }
        public string Tip_Apprentice { get; set; } = "interno";

        public ICollection<PermissionGN>permissionGN { get; set;}
        // Relación con File (Ficha)
        [ForeignKey("File_Id")]
        public FileModel? File { get; set;}

        [ForeignKey("Id_Municipality")]
        public Municipality? Municipality {get;set;} 

    }

}
