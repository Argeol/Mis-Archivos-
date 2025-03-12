using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace bienesoft.Models
{
    public class AuthorizationResponsible
    {
        [Key]
        public int AuthorizationResponsible_Id { get; set; }

        [DisplayName("Permiso")]
        [Required(ErrorMessage = "Permission ID is required")]
        public int Permission_Id { get; set; }

        [DisplayName("Responsable")]
        [Required(ErrorMessage = "Responsible ID is required")]
        public int Responsible_Id { get; set; }

        [DisplayName("Autorizacion")]
        public bool authorization {  get; set; }
    }
}
