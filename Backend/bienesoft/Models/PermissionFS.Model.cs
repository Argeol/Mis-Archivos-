// using System;
// using System.ComponentModel;
// using System.ComponentModel.DataAnnotations;

// namespace bienesoft.Models
// {
//     public class PermissionFS
//     {
//         [Key]
//         public int PermissionFS_Id { get; set; }

//         [Required(ErrorMessage = "La fecha de salida es obligatoria")]
//         [DataType(DataType.Date)]
//         public DateTime Fec_Salida { get; set; }

//         [Required(ErrorMessage = "El destino es obligatorio")]
//         [StringLength(45)]
//         public string Destino { get; set; } = string.Empty;

//         [Required(ErrorMessage = "La fecha de diligencia es obligatoria")]
//         [DataType(DataType.Date)]
//         public DateTime Fec_Diligenciado { get; set; }

//         [Required(ErrorMessage = "La fecha de entrada es obligatoria")]
//         [DataType(DataType.Date)]
//         public string Fec_Entrada { get; set; } = string.Empty;

//         [DisplayName("Apprentice")]
//         [Required(ErrorMessage = "El campo Id_Aprentiz es requerido")]
//         public int Apprentice_Id { get; set; }

//         // Relación con el aprendiz (opcional si lo necesitas navegable)
//         public Apprentice? Apprentice { get; set; }
//     }
// }
