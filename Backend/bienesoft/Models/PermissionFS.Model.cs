using bienesoft.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bienesoft.Models
{
    public class PermissionFS
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PermissionFS_Id { get; set; }

        [ForeignKey("Apprentice")]
        public int Apprentice_Id { get; set; }

        [Required]
        [StringLength(45)]
        public string Destino { get; set; }

        public DateTime? Fec_Salida { get; set; }

        public DateTime? Fec_Entrada { get; set; }

        [Required]
        [StringLength(20)] // suficientemente largo para 'Fin de semana'
        public string Dia_Salida { get; set; } // Ahora es un string

        [StringLength(30)]
        public string Alojamiento { get; set; }

        [Required]
        [StringLength(5)] // suficiente para 'Si' o 'No'
        public string Sen_Empresa { get; set; } // Ahora es un string

        [StringLength(45)]
        public string Direccion { get; set; }

        // Propiedades de navegación
        public Apprentice? Apprentice { get; set; }

        // Propiedades auxiliares para trabajar con enums en C#
        [NotMapped]
        public DiaSalidaEnum DiaSalidaEnum => Enum.Parse<DiaSalidaEnum>(Dia_Salida);

        [NotMapped]
        public SenaEmpresaEnum SenaEmpresaEnum => Enum.Parse<SenaEmpresaEnum>(Sen_Empresa);

        public DateTime? Fec_Diligenciado { get; set; }
    }

    // Enum para 'Dia_Salida'
    public enum DiaSalidaEnum
    {
        Miercoles = 1,
        Domingo = 2,
        FinDeSemana = 3
    }

    // Enum para 'Sen_Empresa'
    public enum SenaEmpresaEnum
    {
        Si = 1,
        No = 2
    }
}
