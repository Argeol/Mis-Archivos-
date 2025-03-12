using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace bienesoft.Models
{
    public class PermissionFS
    {
        [Key]
        public int PermissionFS_Id { get; set; }

        [DisplayName("Apprentice")]
        [Required(ErrorMessage = "El campo Id_Aprentiz es requerido")]
        public int Apprentice_Id { get; set; }

    }
}
