using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace bienesoft.Models
{
    public class Municipality
    {
        [Key] public int Id_municipality { get; set; }

        [DisplayName("Nombre del Municipio")]
        [Required(ErrorMessage = "El Campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "el campo {0} tiene un limite de caracter {1} ")]
        public string municipality { get; set; }

        [DisplayName("Nombre del Municipio")]
        [Required(ErrorMessage = "El Campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "el campo {0} tiene un limite de caracter {1} ")]
        public int state { get; set; }

        public int Id_department { get; set; }

        [ForeignKey("Id_department")]
        public Department Department { get; set; }

        public ICollection<Apprentice> apprentice { get; set; }
    }
}

