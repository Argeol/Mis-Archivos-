// using System.Threading.Tasks;
// using bienesoft.Models;
// using Bienesoft.ProductionDTOs;
// using Microsoft.EntityFrameworkCore;
// using System.Collections.Generic;
// using System.Linq;

// namespace bienesoft.Models
// {
//     public class PermissionService
//     {
//         private readonly AppDbContext _context;

//         public PermissionService(AppDbContext context)
//         {
//             _context = context;
//         }

//         public async Task<List<ApprovalDto>> GetPermissions()
//         {
//             return await _context.permissionApproval.Select(a => new ApprovalDto
//             {
//                 Id = a.Id,
//                 ApprovalDate= a.ApprovalDate.ToString("yyyy-MM-dd"),
//                 Permissions = a.Permission != null
//                 ? new List<PermissionDto>
//                 {
//                     new PermissionDto
//                     {
//                         Id = a.Permission.PermissionId,
//                         Name = a.Permission.Adress
//                     }
//                 }
//                 : new List<PermissionDto>()
//             })
//         .ToListAsync();
//         }

//         public async Task<PermissionDto> GetPermissionById(int id)
//         {
//             var permission = await _context.permissionGN
//                 .Where(p => p.PermissionId == id)
//                 .Select(p => new PermissionDto
//                 {
//                     Id = p.PermissionId,
//                     Name = p.Adress,
//                     Status = p.Status
//                 })
//                 .FirstOrDefaultAsync();
            
//             return permission;
//         }

//         public async Task<bool> CreatePermission(PermissionGN permission)
//         {
//             _context.permissionGN.Add(permission);
//             return await _context.SaveChangesAsync() > 0;
//         }

//         public async Task<bool> ApprovePermission(int permissionId, int responsibleId, bool isApproved)
//         {
//             var approval = new PermissionApproval
//             {
//                 PermissionId = permissionId,
//                 ResponsibleId = responsibleId,
//                 IsApproved = isApproved
//             };

//             _context.permissionApproval.Add(approval);
//             await _context.SaveChangesAsync();

//             var totalApprovals = _context.permissionApproval.Count(p => p.PermissionId == permissionId && p.IsApproved);
//             var requiredApprovals = _context.responsible.Where(r => r.Responsible_Id != 4).Count();

//             if (totalApprovals >= requiredApprovals)
//             {
//                 var permission = await _context.permissionGN.FindAsync(permissionId);
//                 permission.Status = "Approved";
//                 await _context.SaveChangesAsync();
//             }

//             return true;
//         }
//     }
// }