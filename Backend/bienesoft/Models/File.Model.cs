using bienesoft.Models;
using Bienesoft.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class FileModel
{
    [Key]
    public int File_Id { get; set; }

    [Required(ErrorMessage = "Se requiere este campo")]
    [Range(0, 1000, ErrorMessage = "La cantidad de aprendices debe ser un valor entre {1} y {2}")]
    public int Apprentice_count { get; set; }

    [DataType(DataType.Date, ErrorMessage = "El formato de la fecha no es válido")]
    public DateTime? Start_Date { get; set; }  // Ahora es DateTime?

    [DataType(DataType.Date, ErrorMessage = "El formato de la fecha no es válido")]
    public DateTime? End_Date { get; set; }    // Ahora es DateTime?

    public int Program_Id { get; set; }

    [ForeignKey("Program_Id")]
    public ProgramModel? program { get; set; }

    public ICollection<Apprentice>? Apprentice { get; set; }

    [NotMapped] // No se almacena en la base de datos
    public string Status => (End_Date.HasValue && End_Date.Value < DateTime.Now) ? "Expirado" : "Activo";
}
