using System;
using Bienesoft.Models;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bienesoft.Models
{
    public class FileModel
    {
        [Key]
        public int File_Id { get; set; }


        [Required(ErrorMessage = "Se requiere este campo")]
        [Range(0, 1000, ErrorMessage = "La cantidad de aprendices debe ser un valor entre {1} y {2}")]
        public int Apprentice_count { get; set; }


        [Required(ErrorMessage = "Se requiere este campo")]
        [DataType(DataType.Date, ErrorMessage = "El formato de la fecha no es válido")]
        public DateOnly Start_Date { get; set; }

        [Required(ErrorMessage = "Se requiere este campo")]
        [DataType(DataType.Date, ErrorMessage = "El formato de la fecha no es válido")]
        public DateOnly  End_Date { get; set; }

        

        public int Program_Id { get; set; }
        [ForeignKey("Program_Id")]
        public  ProgramModel ?program {get; set;}

        public ICollection<Apprentice>?Apprentice {get; set;}
    }
}
