
﻿using bienesoft.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bienesoft.Models
{
    public class PermissionFS
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Asegura que el ID sea autoincremental
        public int PermissionFS_Id { get; set; }

        [ForeignKey("Apprentice")]
        public int Apprentice_Id { get; set; } // Llave foránea hacia el aprendiz

        [Required]
        [StringLength(45)]
        public string Destino { get; set; }

        public DateTime Fec_Salida { get; set; }

        public DateTime Fec_Entrada { get; set; }

        [Required]
        [EnumDataType(typeof(DiaSalida))]
        public DiaSalida Dia_Salida { get; set; } // Enum para 'Miercoles' o 'Fin de semana'

        [StringLength(30)]
        public string Alojamiento { get; set; }

        [Required]
        [EnumDataType(typeof(SenaEmpresa))]
        public SenaEmpresa Sen_Empresa { get; set; } // Enum para 'Si' o 'No'

        [StringLength(45)]
        public string Direccion { get; set; }

        // Propiedades de navegación
        public Apprentice? Apprentice { get; set; } // Relación con el modelo Apprentice
    }

    public enum DiaSalida
    {
        Miercoes = 1,
        Domingo = 2,
        FinDeSemana = 3
    }

    public enum SenaEmpresa
    {
        Si = 1, 
        No= 2
    }
}

