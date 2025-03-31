using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using Bienesoft.Models;

namespace bienesoft.Models
{
    public class Apprentice
    {
        [Key]
        public int Id_Apprentice { get; set; }

        public string First_Name_Apprentice { get; set; } = string.Empty;
        public string Last_Name_Apprentice { get; set; } = string.Empty;
        public DateTime birth_date_apprentice { get; set; }
        public string Gender_Apprentice { get; set; } = string.Empty;
        public string Email_Apprentice { get; set; } = string.Empty;
        public string Address_Apprentice { get; set; } = string.Empty;
        public string Address_Type_Apprentice { get; set; } = string.Empty;
        public string Phone_Apprentice { get; set; } = string.Empty;
        public string Status_Apprentice { get; set; } = "Active";
        public int Permission_Count_Apprentice { get; set; }
        public string Tip_Apprentice { get; set; } = "interno";
        public string doc_apprentice { get; set; } = string.Empty;
        public string nom_responsible { get; set; } = string.Empty;
        public string ape_responsible { get; set; } = string.Empty;
        public string tel_responsible { get; set; } = string.Empty;
        public string email_responsible { get; set; } = string.Empty;


        // Relación con File (Ficha)
        [ForeignKey("File")]
        public int File_Id { get; set; }
        public FileModel? File { get; set; }

        // Relación con Municipio
        [ForeignKey("Municipality")]
        public int Id_Municipality { get; set; }
        public Municipality? Municipality { get; set; }

        // Relación con permisos
        public ICollection<PermissionGN>? PermissionGN { get; set; }
    }
}
