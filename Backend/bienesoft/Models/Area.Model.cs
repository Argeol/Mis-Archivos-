using System.ComponentModel.DataAnnotations;
using Bienesoft.Models;
using System.ComponentModel;

namespace bienesoft.Models
{
    public class Area
    {
        [Key]
        public int Area_Id { get; set; }

        // [DisplayName("Nombre del Area")]
        [Required(ErrorMessage = "Campo {0} es requerido")]
        [StringLength(100, ErrorMessage = "El campo {0} tiene un limite de caracteres de {1}")]
        public string Area_Name { get; set; }

        public ICollection<ProgramModel> Programs { get; set; } = new List<ProgramModel>();
    }

}
