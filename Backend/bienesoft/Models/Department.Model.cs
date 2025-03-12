using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace bienesoft.Models
{
    public class Department
    {
        [Key]public int Id_department { get; set; }

        [DisplayName("Nombre del Departamento")]
        [Required(ErrorMessage = "El Campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "el campo {0} tiene un limite de caracter {1} ")]
        public string Name_department { get; set; }

        public ICollection<Municipality>municipality{get;set;}
        
    }
}

