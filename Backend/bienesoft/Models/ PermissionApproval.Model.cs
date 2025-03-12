using System.ComponentModel.DataAnnotations;

namespace bienesoft.Models
{
    public class PermissionApproval
    {
        [Key]
        public int Id { get; set; }
        public int PermissionId { get; set; }
        public int ResponsibleId { get; set; }
        public bool IsApproved { get; set; }
        public DateTime ApprovalDate { get; set; } = DateTime.Now;

        public PermissionGN Permission { get; set; }
        public Responsible Responsible { get; set; }
    }
}