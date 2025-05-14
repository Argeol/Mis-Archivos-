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
using Microsoft.EntityFrameworkCore.Diagnostics;

// public class ApprovalService
// {
//     private readonly AppDbContext _context;

//     public ApprovalService(AppDbContext context)
//     {
//         _context = context;
//     }

//     public async Task<ApprovalDTO> GetApprovalByIdAsync(int id)
//     {
//         var approval = await _context.permissionApproval
//      .Include(pa => pa.Permission)
//      .ThenInclude(p => p.Apprentice) // Incluir aprendiz
//      .Include(pa => pa.Responsible)
//      .ThenInclude(r => r.Role) // Incluir rol del responsable
//      .Where(pa => pa.PermissionId == id)
//      .Select(pa => new ApprovalDTO
//      {
//          First_Name_Apprentice = pa.Permission.Apprentice.First_Name_Apprentice,
//          Tip_Apprentice = pa.Permission.Apprentice.Tip_Apprentice,
//          Nom_Responsible = pa.Responsible.Nom_Responsible,
//          Name_role = pa.Responsible.Role.Name_role,
//          Authorization = pa.Permission.Authorization,
//          Motive = pa.Permission.Motive,
//          EntryDate = pa.Permission.EntryDate,
//          DepartureDate = pa.Permission.DepartureDate
//      })
//      .FirstOrDefaultAsync();

//         return approval;
//     }
public class PermissionApprovalService
{
    private readonly AppDbContext _context;

    public PermissionApprovalService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> AprobarPermisoAsync(int idPermiso, int idResponsable)
    {
        var responsable = await _context.responsible
            .Include(r => r.Role)
            .FirstOrDefaultAsync(r => r.Responsible_Id == idResponsable);

        if (responsable == null)
            return "Responsable no encontrado.";

        var permiso = await _context.permissionGN
            .Include(p => p.Approvals)
            .FirstOrDefaultAsync(p => p.PermissionId == idPermiso);

        if (permiso == null)
            return "Permiso no encontrado.";

        if (permiso.Status == Status.Rechazado)
        {
            return "El permiso ya fue rechazado por un responsable.";
        }

        var aprendiz = await _context.apprentice
            .FirstOrDefaultAsync(a => a.Id_Apprentice == permiso.Id_Apprentice);

        if (aprendiz == null)
            return "Aprendiz no encontrado.";

        // Validar si ya aprobó ese rol
        var yaAprobo = await _context.permissionApproval
            .Include(pa => pa.Responsible)

            .AnyAsync(pa =>
                pa.PermissionId == idPermiso &&
                pa.Responsible.RoleId == responsable.RoleId
            );

        if (yaAprobo)
            return "Ya hay un responsable de este rol que aprobó este permiso.";

        // Crear nueva aprobación
        var nuevaAprobacion = new PermissionApproval
        {
            PermissionId = idPermiso,
            ResponsibleId = idResponsable,
            ApprovalDate = DateTime.Now,
            ApprovalStatus = ApprovalStatus.Aprobado
        };

        _context.permissionApproval.Add(nuevaAprobacion);
        await _context.SaveChangesAsync();

        // Definir roles necesarios según tipo de aprendiz
        List<int> rolesRequeridos = aprendiz.Tip_Apprentice == "interno"
            ? new List<int> { 1, 2, 3, 4 } // Interno: Instructor, Coordinador, Bienestar, Internado
            : new List<int> { 1, 2, 3 };   // Externo: Instructor, Coordinador, Bienestar

        // Verificar si ya están todos los roles aprobados
        var aprobacionesActuales = await _context.permissionApproval
            .Where(pa => pa.PermissionId == idPermiso && pa.ApprovalStatus == ApprovalStatus.Aprobado)
            .Include(pa => pa.Responsible)
            .ToListAsync();

        var rolesAprobados = aprobacionesActuales
            .Select(pa => pa.Responsible.RoleId)
            .Distinct()
            .ToList();

        if (rolesRequeridos.All(r => rolesAprobados.Contains(r)))
        {
            permiso.Status = Status.Aprobado;
            await _context.SaveChangesAsync();
        }

        return "Permiso aprobado exitosamente.";
    }
    public async Task<string> RechazarPermisoAsync(int idPermiso, int idResponsable)
    {
        // 1. Verifica que el responsable existe
        var responsable = await _context.responsible
            .Include(r => r.Role)
            .FirstOrDefaultAsync(r => r.Responsible_Id == idResponsable);

        if (responsable == null)
            return "Responsable no encontrado.";

        // 2. Verifica que el permiso existe
        var permiso = await _context.permissionGN
            .Include(p => p.Approvals)
            .FirstOrDefaultAsync(p => p.PermissionId == idPermiso);

        if (permiso == null)
            return "Permiso no encontrado.";

        // 3. Valida si ya ese rol ha respondido (aprobado o rechazado)
        var yaRespondio = await _context.permissionApproval
            .Include(pa => pa.Responsible)
            .AnyAsync(pa =>
                pa.PermissionId == idPermiso &&
                pa.Responsible.RoleId == responsable.RoleId
            );

        if (yaRespondio)
            return "Ya hay un responsable de este rol que respondió este permiso.";

        // 4. Crea la aprobación con estado Rechazado
        var nuevoRechazo = new PermissionApproval
        {
            PermissionId = idPermiso,
            ResponsibleId = idResponsable,
            ApprovalDate = DateTime.Now,
            ApprovalStatus = ApprovalStatus.Rechazado
        };

        _context.permissionApproval.Add(nuevoRechazo);

        // 5. Cambia el estado del permiso a "Rejected" inmediatamente
        permiso.Status = Status.Rechazado;

        await _context.SaveChangesAsync();

        return "Permiso rechazado exitosamente.";
    }
    // public async Task<string> MarcarPendienteAsync(int idPermiso, int idResponsable)
    // {
    //     var responsable = await _context.responsible
    //         .Include(r => r.Role)
    //         .FirstOrDefaultAsync(r => r.Responsible_Id == idResponsable);

    //     if (responsable == null)
    //         return "Responsable no encontrado.";

    //     var permiso = await _context.permissionGN
    //         .Include(p => p.Approvals)
    //         .FirstOrDefaultAsync(p => p.PermissionId == idPermiso);

    //     if (permiso == null)
    //         return "Permiso no encontrado.";

    //     // Verifica si ya existe una aprobación de ese rol
    //     var yaRespondio = await _context.permissionApproval
    //         .Include(pa => pa.Responsible)
    //         .AnyAsync(pa =>
    //             pa.PermissionId == idPermiso &&
    //             pa.Responsible.RoleId == responsable.RoleId
    //         );

    //     if (yaRespondio)
    //         return "Este responsable ya tiene un estado registrado para este permiso.";

    //     // Crea el estado PENDIENTE
    //     var nuevaPendiente = new PermissionApproval
    //     {
    //         PermissionId = idPermiso,
    //         ResponsibleId = idResponsable,
    //         ApprovalDate = DateTime.Now,
    //         ApprovalStatus = ApprovalStatus.Pendiente
    //     };

    //     _context.permissionApproval.Add(nuevaPendiente);
    //     await _context.SaveChangesAsync();

    //     return "Estado pendiente registrado correctamente.";
    // }

    public async Task<object> GetEstadoPermisoAsync(int idPermiso)
    {
        var permiso = await _context.permissionGN
            .Include(p => p.Approvals)
            .ThenInclude(pa => pa.Responsible)
               .ThenInclude(r => r.Role)
            .Include(a => a.Apprentice)
            .FirstOrDefaultAsync(p => p.PermissionId == idPermiso);

        if (permiso == null)
        {
            return new { success = false, message = "Permiso no encontrado." };
        }

        var aprendiz = await _context.apprentice
            .FirstOrDefaultAsync(a => a.Id_Apprentice == permiso.Id_Apprentice);

        if (aprendiz == null)
        {
            return new { success = false, message = "Aprendiz no encontrado." };
        }

        // Determinar los roles necesarios
        List<int> rolesRequeridos = aprendiz.Tip_Apprentice == "interno"
            ? new List<int> { 1, 2, 3, 4 }
            : new List<int> { 1, 2, 3 };

        // Extraer los roles que ya aprobaron
        var aprobaciones = permiso.Approvals
            .Where(pa => pa.ApprovalStatus == ApprovalStatus.Aprobado)
            .Select(pa => pa.Responsible.RoleId)
            .Distinct()
            .ToList();

        var rechazos = permiso.Approvals
            .Any(pa => pa.ApprovalStatus == ApprovalStatus.Rechazado && rolesRequeridos.Contains(pa.Responsible.RoleId));

        string estado;

        if (rechazos)
        {
            estado = Status.Rechazado.ToString();
        }
        else if (rolesRequeridos.All(r => aprobaciones.Contains(r)))
        {
            estado = Status.Aprobado.ToString();
        }
        else
        {
            estado = Status.Pendiente.ToString();
        }

        return new
        {
            success = true,
            estadoPermiso = estado,
            aprendiz = new
            {
                permiso.Apprentice.First_Name_Apprentice,
                permiso.Apprentice.Tip_Apprentice
            },
            aprobaciones = permiso.Approvals.Select(pa => new
            {
                pa.Responsible.Nom_Responsible,
                pa.Responsible.Role.Name_role,
                pa.ApprovalStatus,
                pa.ApprovalDate
            }).ToList()
        };
    }
    public object GetPendingApprovalsBy(int permissionId)
    {
        var pendientes = _context.permissionApproval
            .Include(pa => pa.Permission)
                .ThenInclude(p => p.Apprentice)
                    .ThenInclude(a => a.File)
                        .ThenInclude(f => f.program)
            .Include(pa => pa.Responsible)
                .ThenInclude(r => r.Role)
        .Where(pa => pa.PermissionId == permissionId && pa.Permission.Status == Status.Pendiente)
            .Select(pa => new
            {
                pa.Id, // ApprovalId
                pa.PermissionId,
                pa.Permission.Motive,
                pa.Permission.DepartureDate,
                pa.Permission.EntryDate,
                pa.Permission.Apprentice.Tip_Apprentice,
                // NombreAprendiz = pa.Permission.Apprentice.First_Name_Apprentice,
                // ApellidoAprendiz = pa.Permission.Apprentice.Last_Name_Apprentice,
                // NomAcudiente = pa.Permission.Apprentice.nom_responsible,
                // TelAcudiente = pa.Permission.Apprentice.tel_responsible,
                // ficha = pa.Permission.Apprentice.File.File_Id,
                // programa = pa.Permission.Apprentice.File.program.Program_Name,
                // TipoAprendiz = pa.Permission.Apprentice.Tip_Apprentice,
                RolResponsable = pa.Responsible.Role.Name_role,
                id_aprendiz = pa.Permission.Apprentice.Id_Apprentice
            })
            .ToList(); // <-- ahora retorna todos

        return pendientes;
    }
    public async Task<List<PermissionApproval>> ObtenerPermisosPendientesPorResponsableAsync(int idResponsable)
    {
        // Devuelve todos los registros de la tabla compuesta donde:
        // - Ese responsable es el asignado
        // - El estado está en Pendiente
        var permisosPendientes = await _context.permissionApproval
            .Include(pa => pa.Permission) // Incluye los datos del permiso
                .ThenInclude(p => p.Apprentice) // si quieres también el aprendiz
            .Where(pa => pa.ResponsibleId == idResponsable && pa.ApprovalStatus == ApprovalStatus.Pendiente)
            .ToListAsync();

        return permisosPendientes;
    }



}

