// using bienesoft.Models;
// using Bienesoft.Models;
// using Microsoft.EntityFrameworkCore;

// namespace Bienesoft.Services
// {
//     public class ApprovalService
//     {
//         private readonly AppDbContext _context;

//         public ApprovalService(AppDbContext context)
//         {
//             _context = context;
//         }

//         public async Task<bool> ApprovePermission(int permissionId, int responsibleId, bool isApproved)
//         {
//             // Crear un nuevo registro de aprobación
//             var approval = new PermissionApproval
//             {
//                 PermissionId = permissionId,
//                 ResponsibleId = responsibleId,
//                 IsApproved = isApproved
//             };

//             _context.permissionApproval.Add(approval);
//             await _context.SaveChangesAsync();

//             // Contar cuántas aprobaciones positivas hay para este permiso
//             var totalApprovals = await _context.permissionApproval
//                 .CountAsync(p => p.PermissionId == permissionId && p.IsApproved);

//             // Obtener la cantidad de responsables que pueden aprobar (excluyendo ID = 4)
//             var requiredApprovals = await _context.responsible
//                 .CountAsync(r => r.Responsible_Id != 4);

//             // Si el número de aprobaciones es suficiente, cambiar el estado del permiso a "Approved"
//             if (totalApprovals >= requiredApprovals)
//             {
//                 var permission = await _context.permissionGN.FindAsync(permissionId);
//                 if (permission != null)
//                 {
//                     permission.Status = "Approved";
//                     await _context.SaveChangesAsync();
//                 }
//             }

//             return true;
//         }
//     }
// }
