
using System.ComponentModel.DataAnnotations;

namespace Bienesoft.Models
{
    public class Attendant
    {
        [Key]
        public int Attendant_Id { get; set; }

        [Required(ErrorMessage = "El nombre del asistente es obligatorio.")]
        [StringLength(45, ErrorMessage = "El nombre no puede tener más de 45 caracteres.")]
        public string Attendant_Name { get; set; }

        [Required(ErrorMessage = "El apellido del asistente es obligatorio.")]
        [StringLength(45, ErrorMessage = "El apellido no puede tener más de 45 caracteres.")]
        public string Attendant_Surname { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio.")]
        [Range(1000000, 9999999999, ErrorMessage = "El número de teléfono debe ser válido.")]
        public long Attendant_Phone { get; set; }

        [Required(ErrorMessage = "La dirección es obligatoria.")]
        [StringLength(45, ErrorMessage = "La dirección no puede tener más de 45 caracteres.")]
        public string Attendant_Address { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "Debe ser un correo electrónico válido.")]
        [StringLength(45, ErrorMessage = "El correo electrónico no puede tener más de 45 caracteres.")]
        public string Attendant_Email { get; set; }

        [Required(ErrorMessage = "La edad es obligatoria.")]
        public DateTime Date_Birth { get; set; }
    }
    public class UpdateModelAttendant {

        [Required(ErrorMessage = "El nombre del asistente es obligatorio.")]
        [StringLength(45, ErrorMessage = "El nombre no puede tener más de 45 caracteres.")]
        public string Attendant_Name { get; set; }

        [Required(ErrorMessage = "El apellido del asistente es obligatorio.")]
        [StringLength(45, ErrorMessage = "El apellido no puede tener más de 45 caracteres.")]
        public string Attendant_Surname { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio.")]
        [Range(1000000, 9999999999, ErrorMessage = "El número de teléfono debe ser válido.")]
        public long Attendant_Phone { get; set; }

        [Required(ErrorMessage = "La dirección es obligatoria.")]
        [StringLength(45, ErrorMessage = "La dirección no puede tener más de 45 caracteres.")]
        public string Attendant_Address { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "Debe ser un correo electrónico válido.")]
        [StringLength(45, ErrorMessage = "El correo electrónico no puede tener más de 45 caracteres.")]
        public string Attendant_Email { get; set; }

    }


}
