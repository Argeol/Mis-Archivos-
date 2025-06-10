using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using bienesoft.Models;

namespace bienesoft.models
{
    [Table("user", Schema = "bienesoft")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [DisplayName("User_Id")]
        public int User_Id { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(100, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        [EmailAddress(ErrorMessage = "El campo {0} no es una dirección de correo electrónico válida")]
        [DisplayName("Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(255, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        [DisplayName("Hashed Password")]
        public string HashedPassword { get; set; }

        [DisplayName("Salt")]
        public string? Salt { get; set; } = null; // O usa un valor predeterminado como "default_salt"

        [DisplayName("Token JWT")]
        public string? TokJwt { get; set; } = null; // O algún valor de token predeterminado

        [DefaultValue(0)]
        [DisplayName("Session Count")]
        public int SessionCount { get; set; }

        [DefaultValue(false)]
        [DisplayName("Blocked")]
        public bool Blockade { get; set; }

        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        [DisplayName("User Type")]
        public string UserType { get; set; }

        [DefaultValue(true)]
        [DisplayName("Active")]
        public bool Asset { get; set; }

        // Reset pass
        public string? ResetToken { get; set; } = null;
        public DateTime? ResetTokenExpiration { get; set; }

        // Relaciones con Apprentice y Responsible
        public int? Id_Apprentice { get; set; }

        [ForeignKey("Id_Apprentice")]
        public Apprentice? Apprentice { get; set; }

        public int? Responsible_Id { get; set; }
        [ForeignKey("Responsible_Id")]
        public ResponsibleModel? Responsible { get; set; }

        [Required, StringLength(20)]
        public string Status_User { get; set; } = "Activo";
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }


    public class ResetPassUser
    {
        [Required(ErrorMessage = "El correo es requerido")]
        [EmailAddress(ErrorMessage = "Formato de correo electrónico inválido")]
        public string Email { get; set; }
    }

    public class LoginUser
    {
        public string Email { get; set; }
        public string HashedPassword { get; set; }
    }

    public class Administrador
    {
        public int? User_Id { get; set; }
        public string? Email { get; set; }

    }

    public class ResetPasswordModel
    {
        public string? Token { get; set; } = null;
        public string? NewPassword { get; set; } = null;
    }
    public class UserDataDto
    {
        public string Email { get; set; }
        public string Role { get; set; }
        public string FullName { get; set; }
        public string IdApprentice { get; set; }
        public string ResponsibleId { get; set; }
    }
    public class UserLoginResponseDTO
    {
        public int Responsible_Id { get; set; }
        public string Nom_Responsible { get; set; }
        public string Ape_Responsible { get; set; }
        public long? Tel_Responsible { get; set; }
        public string Email_Responsible { get; set; } = string.Empty;
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role? Role { get; set; }
        public string? State { get; set; }
    }

}
