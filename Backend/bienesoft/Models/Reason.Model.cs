using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace bienesoft.Models
{
    public class Reason
    {
        [Key]
        public int Reason_Id { get; set; }

        [DisplayName("Tipo de Motivo")]
        [StringLength(50, ErrorMessage = "El campo {0} tiene un límite de {1} caracteres.")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public string Tip_Reason { get; set; }
    }
}
