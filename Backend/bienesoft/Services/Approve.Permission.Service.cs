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



//     }
// }

// //         public async Task<bool> ApprovePermission(int permissionId, int responsibleId, bool isApproved)
// //         {
// //             // Crear un nuevo registro de aprobación
// //             var approval = new PermissionApproval
// //             {
// //                 PermissionId = permissionId,
// //                 ResponsibleId = responsibleId,
// //                 IsApproved = isApproved
// //             };

// //             _context.permissionApproval.Add(approval);
// //             await _context.SaveChangesAsync();

// //             // Contar cuántas aprobaciones positivas hay para este permiso
// //             var totalApprovals = await _context.permissionApproval
// //                 .CountAsync(p => p.PermissionId == permissionId && p.IsApproved);

// //             // Obtener la cantidad de responsables que pueden aprobar (excluyendo ID = 4)
// //             var requiredApprovals = await _context.responsible
// //                 .CountAsync(r => r.Responsible_Id != 4);

// //             // Si el número de aprobaciones es suficiente, cambiar el estado del permiso a "Approved"
// //             if (totalApprovals >= requiredApprovals)
// //             {
// //                 var permission = await _context.permissionGN.FindAsync(permissionId);
// //                 if (permission != null)
// //                 {
// //                     permission.Status = "Approved";
// //                     await _context.SaveChangesAsync();
// //                 }
// //             }

// //             return true;
// //         }
// //     }
// // }
using Bienesoft.ProductionDTOs;
// using bienesoft.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using bienesoft.Models;

public class ApprovalService
{
    private readonly AppDbContext _context;

    public ApprovalService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ApprovalDTO> GetApprovalByIdAsync(int id)
    {
        var approval = await _context.permissionApproval
     .Include(pa => pa.Permission)
     .ThenInclude(p => p.Apprentice) // Incluir aprendiz
     .Include(pa => pa.Responsible)
     .ThenInclude(r => r.Role) // Incluir rol del responsable
     .Where(pa => pa.PermissionId == id)
     .Select(pa => new ApprovalDTO
     {
         First_Name_Apprentice = pa.Permission.Apprentice.First_Name_Apprentice,
         Tip_Apprentice = pa.Permission.Apprentice.Tip_Apprentice,
         Nom_Responsible = pa.Responsible.Nom_Responsible,
         Name_role = pa.Responsible.Role.Name_role,
         Authorization = pa.Permission.Authorization,
         Motive = pa.Permission.Motive,
         EntryDate = pa.Permission.EntryDate,
         DepartureDate = pa.Permission.DepartureDate
     })
     .FirstOrDefaultAsync();

        return approval;
    }
}

