
using System.ComponentModel.DataAnnotations;
using bienesoft.Models;

namespace Bienesoft.Models
{
    public class Attendant
    {
        [Key]
        public int? Attendant_Id { get; set; }

        [Required]
        [StringLength(45)]
        public string Attendant_Name { get; set; }

        [Required]
        [StringLength(45)]
        public string Attendant_Surname { get; set; }

        [Required]
        public string Attendant_Phone {get; set;}
        [Required]
        [StringLength(45)]
        public string Attendant_Address { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(45)]
        public string Attendant_Email { get; set; }

        [Required]
        public DateTime Date_Birth { get; set; }

        // Clave foránea para Municipio
        [Required]
        public int Id_Municipality { get; set; }

        // Propiedad de navegación (relación con Municipio)
        public Municipality? Municipality { get; set; }

        public ICollection<Apprentice>Apprentices {get; set;}
    }

    public class UpdateModelAttendant
    {

        [Required(ErrorMessage = "El nombre del asistente es obligatorio.")]
        [StringLength(45, ErrorMessage = "El nombre no puede tener más de 45 caracteres.")]
        public string Attendant_Name { get; set; }

        [Required(ErrorMessage = "El apellido del asistente es obligatorio.")]
        [StringLength(45, ErrorMessage = "El apellido no puede tener más de 45 caracteres.")]
        public string Attendant_Surname { get; set; }

        public string Attendant_Phone { get; set; }

        [Required(ErrorMessage = "La dirección es obligatoria.")]
        [StringLength(45, ErrorMessage = "La dirección no puede tener más de 45 caracteres.")]
        public string Attendant_Address { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "Debe ser un correo electrónico válido.")]
        [StringLength(45, ErrorMessage = "El correo electrónico no puede tener más de 45 caracteres.")]
        public string Attendant_Email { get; set; }

    }


}
