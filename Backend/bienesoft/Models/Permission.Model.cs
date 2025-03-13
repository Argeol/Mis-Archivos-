using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace bienesoft.Models
{
    public class Permission
    {
        [Key]
        public int Permission_Id { get; set; }


        [DisplayName("Fecha de Salida")]
        [Required(ErrorMessage = "Se requiere este campo")]
        public DateTime Departure_Date { get; set; }



        [DisplayName("Fecha de Entrada")]
        [Required(ErrorMessage = "Se requiere este campo")]
        public DateTime Entry_Date { get; set; }



        [DisplayName("Fecha")]
        [Required(ErrorMessage = "Se requiere este campo")]
        public DateTime Application_Date { get; set; } = DateTime.Now;



        [DefaultValue(false)]
        public bool? Autorization { get; set; } = null;



        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(35, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        [DisplayName("Direccion")]
        public string Adress {  get; set; }



        [Required(ErrorMessage = "El campo {0} es requerido")]
        [StringLength(35, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        [DisplayName("Destino")]
        public string Destinatation { get; set; }



        [StringLength(45, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        [DisplayName("Motivo")]
        public string Motive { get; set; }



        [StringLength(50, ErrorMessage = "El campo {0} tiene un límite de caracteres de {1}")]
        [DisplayName("Observacion")]
        public string Observation { get; set; }

        

        [DisplayName("Id de ResponsableAutorizacion")]
        public int PermissionRespon_Id { get; set; }


    }
}
