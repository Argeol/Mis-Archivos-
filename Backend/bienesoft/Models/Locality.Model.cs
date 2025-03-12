using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace bienesoft.Models
{
    public class Locality
    {
        [Key]
        public int Locality_Id { get; set; }

        [DisplayName("Nombre de la Localidad")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(50, ErrorMessage = "El campo {0} tiene un límite de {1} caracteres.")]
        public string Locality_Name { get; set; }

        [DisplayName("Tipo de Localidad")]
        [StringLength(30, ErrorMessage = "El campo {0} tiene un límite de {1} caracteres.")]
        [Required(ErrorMessage = "El campo {0} es requerido")]
        public string Locality_Type { get; set; }

        [DisplayName("Departamento")]
        [Required(ErrorMessage = "El campo Id_Departamento es requerido")]
        public int Department_Id { get; set; }
        [ForeignKey("Department_Id")]
        public Department department { get; set; }
    }
}