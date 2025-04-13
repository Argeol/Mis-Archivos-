using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bienesoft.Models
{
    public class PermissionGN
    {
        public PermissionGN()
        {
            ApplicationDate = DateTime.Now;
        }
        [Key]
        public int PermissionId { get; set; }
        public DateTime DepartureDate { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime ApplicationDate { get; set; } = DateTime.Now;
        public string Adress { get; set; }
        public string Destination { get; set; }

        public string Motive { get; set; }
        public string Observation { get; set; }

        public Status Status { get; set; } = Status.Pendiente;
        public int Id_Apprentice { get; set; }

        [ForeignKey("Id_Apprentice")]
        public Apprentice? Apprentice { get; set; }
        public ICollection<PermissionApproval> Approvals { get; set; } = new List<PermissionApproval>();

    }
    public enum Status
    {
        Pendiente = 0,
        Aprobado = 1,
        Rechazado = 2
    }
    public class UpdatePermiso
    {
        //FechaDeSalida
        public DateTime? DepartureDate { get; set; }
        //FechaDeEntrada
        public DateTime? EntryDate { get; set; }
        public string? Adress { get; set; }
        public string? Destination { get; set; }
        public string? Motive { get; set; }
        public string? Observation { get; set; }
    }
    public class CreatePermissionRequest
    {
        public PermissionGN Permission { get; set; }
        public List<int> ResponsablesSeleccionados { get; set; }
    }

}
