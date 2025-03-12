using System.ComponentModel.DataAnnotations;

namespace bienesoft.Models
{
    public class PermissionGN
    {
        
        [Key]
        public int PermissionId { get; set; }
        public int ApprenticeId { get; set; }
        public DateTime DepartureDate { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime ApplicationDate { get; set; } = DateTime.Now;
        public bool Authorization { get; set; }
        public string Adress { get; set; }
        public string Destinatation { get; set; }
        public string Motive { get; set; }
        public string Observation { get; set; }
        public bool IsInternal { get; set; }
        public string Status { get; set; } = "Pending";

        public ICollection<PermissionApproval> Approvals { get; set; }
    }


}
