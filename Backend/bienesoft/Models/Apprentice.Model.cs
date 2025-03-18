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

        [Required]
        public string First_Name_Apprentice { get; set; } = string.Empty;

        [Required]
        public string Last_Name_Apprentice { get; set; } = string.Empty;

        [Required]
        public DateTime Birth_Date_Apprentice { get; set; }

        [Required]
        public string Gender_Apprentice { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email_Apprentice { get; set; } = string.Empty;

        public string Address_Apprentice { get; set; } = string.Empty;
        public string Address_Type_Apprentice { get; set; } = string.Empty;
        public string Phone_Apprentice { get; set; } = string.Empty;
        public string Status_Apprentice { get; set; } = "Active";
        public int Permission_Count_Apprentice { get; set; }

        public string Tip_Apprentice { get; set; } = "interno";

        // Relación con File (Ficha)
        [ForeignKey("File")]
        public int File_Id { get; set; }
        public FileModel? File { get; set; }

        // Relación con Municipio
        [ForeignKey("Municipality")]
        public int Id_Municipality { get; set; }
        public Municipality? Municipality { get; set; }

        // Relación con Attendant (Acompañante)
        [ForeignKey("Attendant")]
        public int Attendant_Id { get; set; }
        public Attendant? Attendant { get; set; }

        // Relación con permisos
        public ICollection<PermissionGN>? PermissionGN { get; set; }
    }
}
