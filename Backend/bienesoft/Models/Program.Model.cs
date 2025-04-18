﻿using bienesoft.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Bienesoft.Models
{
    public class ProgramModel
    {
        [Key] public int Program_Id { get; set; }

        [Required(ErrorMessage = "El nombre del programa es obligatorio.")]
        [StringLength(255, ErrorMessage = "El nombre no puede tener más de 35 caracteres.")]
        public string Program_Name { get; set; }

        public int? Area_Id { get; set; }
        [ForeignKey("Area_Id")]
        public Area? Area { get; set; }

        public ICollection<FileModel>? FileModels { get; set; } = new List<FileModel>();

        [Required]
        [EnumDataType(typeof(ProgramState))]
        public string State { get; set; } = ProgramState.Activo.ToString();
    }

    public class UpdateModelProgram
    {
        public string? Program_Name { get; set; }
        public int? Area_Id { get; set; } = null;
        public string? State { get; set; }
    }

    public class ResgisterProgram
    {
        [Key] public int Program_Id { get; set; }

        [Required(ErrorMessage = "El nombre del programa es obligatorio.")]
        [StringLength(255, ErrorMessage = "El nombre no puede tener más de 255 caracteres.")]
        public string Program_Name { get; set; }

        public int Area_Id { get; set; }

        [Required]
        [EnumDataType(typeof(ProgramState))]
        public string State { get; set; } = ProgramState.Activo.ToString();
    }

    public enum ProgramState
    {
        Activo,
        Inactivo
    }
}
