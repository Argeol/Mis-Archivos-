using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bienesoft.Models
{
    public class PermissionApproval
{
    public int Id { get; set; }
    public int PermissionId { get; set; }
    public int ResponsibleId { get; set; }
    public DateTime? ApprovalDate { get; set; }

    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Pendiente;

    public PermissionGN Permission { get; set; }
    public ResponsibleModel Responsible { get; set; }
}
public enum ApprovalStatus
{
        Pendiente = 0,
        Aprobado = 1,
        Rechazado = 2
    }

}