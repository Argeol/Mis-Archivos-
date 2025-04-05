using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("PermissionId")]
        public PermissionGN Permission { get; set; }

        [ForeignKey("ResponsibleId")]
        public ResponsibleModel Responsible { get; set; }
    }
}