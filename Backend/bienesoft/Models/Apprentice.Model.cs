using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using Bienesoft.Models;

namespace bienesoft.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using bienesoft.models;

    public class Apprentice
    {
        [Key]
        public int Id_Apprentice { get; set; }

        [Required, StringLength(100)]
        public string First_Name_Apprentice { get; set; } = string.Empty;

        [Required, StringLength(100)]
        public string Last_Name_Apprentice { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime? birth_date_apprentice { get; set; }

        [Required, StringLength(20)]
        public string Gender_Apprentice { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email_Apprentice { get; set; } = string.Empty;

        [Required, StringLength(200)]
        public string Address_Apprentice { get; set; } = string.Empty;

        // [Required, StringLength(50)]
        public string Address_Type_Apprentice { get; set; } = string.Empty;

        [Required, Phone, StringLength(20)]
        public string Phone_Apprentice { get; set; } = string.Empty;

        [Required]
        public string Stratum_Apprentice { get; set; } = string.Empty;

        [Required, StringLength(20)]
        public string Status_Apprentice { get; set; } = "Activo";

        [Required]
        public int Permission_Count_Apprentice { get; set; } = 0;

        [Required, StringLength(20)]
        public string Tip_Apprentice { get; set; } = "interno";

        [Required, StringLength(5)]
        public string tip_document { get; set; } = "CC";

        [Required, StringLength(45)]
        public string nom_responsible { get; set; } = string.Empty;

        [Required, StringLength(45)]
        public string ape_responsible { get; set; } = string.Empty;

        [Required, Phone, StringLength(12)]
        public string tel_responsible { get; set; } = string.Empty;

        [EmailAddress]
        public string email_responsible { get; set; } = string.Empty;

        [Required]
        public int File_Id { get; set; }

        // [Required]
        public int? id_municipality { get; set; }

        // Relaciones
        public Municipality? Municipality { get; set; }
        public FileModel? File { get; set; }
        public ICollection<PermissionGN>? PermissionGN { get; set; }
    }

    public class UpdateApprentice
    {
        public string? first_name_apprentice { get; set; }
        public string? last_name_apprentice { get; set; }
        public DateTime? birth_date_apprentice { get; set; }
        public string? gender_apprentice { get; set; }
        public string? email_apprentice { get; set; }
        public string? address_apprentice { get; set; }
        public string? address_type_apprentice { get; set; }
        public string? phone_Apprentice { get; set; }
        public string? Stratum_apprentice { get; set; }
        public string? status_Apprentice { get; set; } = "Activo";
        public string? Tip_Apprentice { get; set; }
        public string? tip_document { get; set; }
        public string? nom_responsible { get; set; }
        public string? ape_responsible { get; set; }
        public string? tel_responsible { get; set; }
        public string? email_responsible { get; set; }
        public int? id_municipality { get; set; }
        public int? File_Id { get; set; }
    }
}
