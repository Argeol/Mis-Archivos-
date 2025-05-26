using Microsoft.EntityFrameworkCore;
using bienesoft.Models;
using bienesoft.Funcions;

public class PermissionApprovalService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    public GeneralFunction GeneralFunction;
    private string ObtenerNombreRol(int roleId)
    {
        return roleId switch
        {
            1 => "Instructor",
            2 => "Coordinador",
            3 => "Bienestar",
            4 => "Internado",
            _ => "Responsable"
        };
    }




    public PermissionApprovalService(IConfiguration configuration, AppDbContext context)
    {
        _context = context;
        _configuration = configuration;
        GeneralFunction = new GeneralFunction(_configuration); // Inicializa GeneralFunction aquí

    }

    public async Task<string> AprobarPermisoAsync(int idPermiso, int idResponsable)
    {
        var permiso = await _context.permissionGN
            .Include(p => p.Approvals)
            .FirstOrDefaultAsync(p => p.PermissionId == idPermiso);

        if (permiso == null)
            return "Permiso no encontrado.";

        if (permiso.Status == Status.Rechazado)
            return "El permiso ya fue rechazado por un responsable.";

        var aprendiz = await _context.apprentice
            .FirstOrDefaultAsync(a => a.Id_Apprentice == permiso.Id_Apprentice);

        if (aprendiz == null)
            return "Aprendiz no encontrado.";

        var aprobacionExistente = await _context.permissionApproval
            .FirstOrDefaultAsync(pa => pa.PermissionId == idPermiso && pa.ResponsibleId == idResponsable);

        if (aprobacionExistente == null)
            return "No se encontró la aprobación correspondiente para este responsable.";

        if (aprobacionExistente.ApprovalStatus != ApprovalStatus.Pendiente)
            return "Usted ya ha aprobado o rechazado el permiso.";

        aprobacionExistente.ApprovalStatus = ApprovalStatus.Aprobado;
        aprobacionExistente.ApprovalDate = DateTime.Now;
        await _context.SaveChangesAsync();

        var ordenRoles = aprendiz.Tip_Apprentice == "interno"
            ? new List<int> { 1, 2, 3, 4 }
            : new List<int> { 1, 2, 3 };

        var aprobacionesActuales = await _context.permissionApproval
            .Where(pa => pa.PermissionId == idPermiso)
            .Include(pa => pa.Responsible)
            .ToListAsync();

        var rolesAprobados = aprobacionesActuales
            .Where(pa => pa.ApprovalStatus == ApprovalStatus.Aprobado)
            .Select(pa => pa.Responsible.RoleId)
            .Distinct()
            .ToList();

        if (ordenRoles.All(r => rolesAprobados.Contains(r)))
        {
            permiso.Status = Status.Aprobado;
            await _context.SaveChangesAsync();
            if (aprendiz != null)
            {
                var nombreAprendiz = $"{aprendiz.First_Name_Apprentice} {aprendiz.Last_Name_Apprentice}";
                var emailAprendiz = aprendiz.Email_Apprentice;

                var res = await GeneralFunction.NotifyAprendizAsync(emailAprendiz, nombreAprendiz);
            }
        }
        else
        {
            string nombreAprendiz = $"{aprendiz.First_Name_Apprentice} {aprendiz.Last_Name_Apprentice}";

            var siguienteAprobacionPendiente = aprobacionesActuales
                .Where(pa => pa.ApprovalStatus == ApprovalStatus.Pendiente)
                .OrderBy(pa => pa.Responsible.RoleId)
                .FirstOrDefault();

            if (siguienteAprobacionPendiente != null)
            {
                var siguienteResponsable = siguienteAprobacionPendiente.Responsible;
                string emailDestino = siguienteResponsable.Email_Responsible;
                string nombreRol = ObtenerNombreRol(siguienteResponsable.RoleId);

                await GeneralFunction.NotifyResponsibleAsync(emailDestino, nombreRol, nombreAprendiz);
            }
        }

        return "Permiso aprobado exitosamente.";
    }


    public async Task<string> RechazarPermisoAsync(int idPermiso, int idResponsable)
    {
        // 1. Verifica que el responsable exista
        var responsable = await _context.responsible
            .Include(r => r.Role)
            .FirstOrDefaultAsync(r => r.Responsible_Id == idResponsable);

        if (responsable == null)
            return "Responsable no encontrado.";

        // 2. Verifica que el permiso exista
        var permiso = await _context.permissionGN
            .Include(p => p.Approvals)
            .FirstOrDefaultAsync(p => p.PermissionId == idPermiso);

        if (permiso == null)
            return "Permiso no encontrado.";

        // 3. Busca la aprobación ya creada para este responsable
        var aprobacion = await _context.permissionApproval
            .FirstOrDefaultAsync(pa =>
                pa.PermissionId == idPermiso &&
                pa.ResponsibleId == idResponsable);

        if (aprobacion == null)
            return "No existe aprobación previa para este responsable.";

        // 4. Verifica que esté pendiente
        if (aprobacion.ApprovalStatus != ApprovalStatus.Pendiente)
            return "Este responsable ya respondió este permiso.";

        // 5. Actualiza la aprobación a Rechazado
        aprobacion.ApprovalStatus = ApprovalStatus.Rechazado;
        aprobacion.ApprovalDate = DateTime.Now;

        // 6. Cambia el estado global del permiso a "Rechazado"
        permiso.Status = Status.Rechazado;

        await _context.SaveChangesAsync();

        return "Permiso rechazado exitosamente.";
    }

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
                aprendiz = permiso.Apprentice.First_Name_Apprentice + " " + permiso.Apprentice.Last_Name_Apprentice,
                permiso.Apprentice.Tip_Apprentice
            },
            aprobaciones = permiso.Approvals.Select(pa => new
            {
                Nombre = pa.Responsible.Nom_Responsible + " " + pa.Responsible.Ape_Responsible,
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
                RolResponsable = pa.Responsible.Role.Name_role,
                id_aprendiz = pa.Permission.Apprentice.Id_Apprentice
            })
            .ToList(); // <-- ahora retorna todos

        return pendientes;
    }
    public async Task<List<PermissionApproval>> ObtenerPermisosPendientesPorResponsableAsync(int idResponsable)
    {
        var permisosPendientes = await _context.permissionApproval
            .Include(pa => pa.Permission) // Incluye los datos del permiso
                .ThenInclude(p => p.Apprentice) // si quieres también el aprendiz
            .Where(pa => pa.ResponsibleId == idResponsable && pa.ApprovalStatus == ApprovalStatus.Pendiente)
            .ToListAsync();

        return permisosPendientes;
    }
}

