using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using bienesoft.models;

namespace bienesoft.Models
{
    public class ResponsibleModel 
    {
        [Key]
        public int Responsible_Id { get; set; }

        [DisplayName("Nombre del responsable")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "El campo {0} tiene un límite de {1} caracteres.")]
        public string? Nom_Responsible { get; set; }

        [DisplayName("Apellido del responsable")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(45, ErrorMessage = "El campo {0} tiene un límite de {1} caracteres.")]
        public string? Ape_Responsible { get; set; }

        [DisplayName("Teléfono del responsable")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [Range(1000000000, 9999999999, ErrorMessage = "El número de teléfono debe tener 10 dígitos.")]
        public long? Tel_Responsible { get; set; }

        [Required(ErrorMessage = "El campo {0} es obligatorio")]
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role? Role { get; set; }

        public string? State { get; set; } = "Activo";

        public ICollection<PermissionApproval>? PermissionApprovals { get; set; }
        public ICollection<User>? Users { get; set; }

        [Required, EmailAddress]
        public string Email_Responsible { get; set; } = string.Empty;
    }

    public class UpdateResponsible
    {
        public string? Nom_Responsible { get; set; }

        public string? Ape_Responsible { get; set; }
        public long? Tel_Responsible { get; set; }
        public int? RoleId { get; set; }
        public string? State { get; set; } = "Activo";

    }

    
}
