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

        var aprobacionActual = await _context.permissionApproval
            .Include(pa => pa.Responsible)
            .FirstOrDefaultAsync(pa => pa.PermissionId == idPermiso && pa.ResponsibleId == idResponsable);

        if (aprobacionActual == null)
            return "No se encontró la aprobación correspondiente para este responsable.";

        if (aprobacionActual.ApprovalStatus != ApprovalStatus.Pendiente)
            return "Usted ya ha aprobado o rechazado el permiso.";

        // ORDEN de aprobación
        var ordenRoles = aprendiz.Tip_Apprentice == "interno"
            ? new List<int> { 1, 2, 3, 4 }
            : new List<int> { 1, 2, 3 };

        var roleActual = aprobacionActual.Responsible.RoleId;
        var indexRolActual = ordenRoles.IndexOf(roleActual);

        // Validar si todos los roles anteriores ya aprobaron
        if (indexRolActual > 0) // si NO es el primero en la lista
        {
            var rolesPrevios = ordenRoles.Take(indexRolActual).ToList();

            var aprobaciones = await _context.permissionApproval
                .Include(pa => pa.Responsible)
                .Where(pa => pa.PermissionId == idPermiso)
                .ToListAsync();

            var rolesPreviosAprobados = aprobaciones
                .Where(pa => rolesPrevios.Contains(pa.Responsible.RoleId) && pa.ApprovalStatus == ApprovalStatus.Aprobado)
                .Select(pa => pa.Responsible.RoleId)
                .ToList();

            if (rolesPrevios.Except(rolesPreviosAprobados).Any())
            {
                return "No puede aprobar aún. Debe esperar a que el responsable anterior apruebe el permiso.";
            }
        }

        // Aprobación válida
        aprobacionActual.ApprovalStatus = ApprovalStatus.Aprobado;
        aprobacionActual.ApprovalDate = DateTime.Now;
        await _context.SaveChangesAsync();

        // Verificar si todos ya aprobaron
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

            // var estadoPermiso = await GetEstadoPermisoAsync(idPermiso);

            var nombreAprendiz = $"{aprendiz.First_Name_Apprentice} {aprendiz.Last_Name_Apprentice}";
            var emailAprendiz = aprendiz.Email_Apprentice;
            var tipoAprendiz = aprendiz.Tip_Apprentice;
            var acudiente = $"{aprendiz.nom_responsible} {aprendiz.ape_responsible}";
            var acudienteTel = $"{aprendiz.tel_responsible}";

            // Convertir aprobaciones a lista HTML
            var aprobaciones = await GetAprobacionesHtmlAsync(idPermiso);

            var resultadoEnvio = await GeneralFunction.NotifyAprendizAsync(emailAprendiz, nombreAprendiz, tipoAprendiz, aprobaciones, acudiente,acudienteTel);
        }

        else
        {
            var siguienteAprobacionPendiente = aprobacionesActuales
                .Where(pa => pa.ApprovalStatus == ApprovalStatus.Pendiente)
                .OrderBy(pa => pa.Responsible.RoleId)
                .FirstOrDefault();

            if (siguienteAprobacionPendiente != null)
            {
                var siguienteResponsable = siguienteAprobacionPendiente.Responsible;
                string emailDestino = siguienteResponsable.Email_Responsible;

                string nombreAprendiz = $"{aprendiz.First_Name_Apprentice} {aprendiz.Last_Name_Apprentice}";
                string nombreRol = ObtenerNombreRol(siguienteResponsable.RoleId);

                await GeneralFunction.NotifyResponsibleAsync(emailDestino, nombreRol, nombreAprendiz);
            }
        }

        return "Permiso aprobado exitosamente.";
    }
    public async Task<List<string>> GetAprobacionesHtmlAsync(int idPermiso)
    {
        var aprobaciones = await _context.permissionApproval
            .Include(pa => pa.Responsible)
                .ThenInclude(r => r.Role)
            .Where(pa => pa.PermissionId == idPermiso && pa.ApprovalStatus == ApprovalStatus.Aprobado)
            .ToListAsync();

        return aprobaciones
            .Select(a => $"{a.Responsible.Nom_Responsible} {a.Responsible.Ape_Responsible} ({a.Responsible.Role.Name_role}) - {a.ApprovalDate:yyyy-MM-dd}")
            .ToList();
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

        if (permiso.Status == Status.Aprobado || permiso.Status == Status.Rechazado)
            return "El permiso ya fue aprobado o rechazado.";

        // 3. Busca el aprendiz
        var aprendiz = await _context.apprentice
            .FirstOrDefaultAsync(a => a.Id_Apprentice == permiso.Id_Apprentice);

        if (aprendiz == null)
            return "Aprendiz no encontrado.";

        // 4. Busca la aprobación ya creada para este responsable
        var aprobacion = await _context.permissionApproval
            .Include(pa => pa.Responsible)
            .FirstOrDefaultAsync(pa =>
                pa.PermissionId == idPermiso &&
                pa.ResponsibleId == idResponsable);

        if (aprobacion == null)
            return "No existe aprobación previa para este responsable.";

        if (aprobacion.ApprovalStatus != ApprovalStatus.Pendiente)
            return "Este responsable ya respondió este permiso.";

        // 5. Verifica el orden de aprobación
        var ordenRoles = aprendiz.Tip_Apprentice == "interno"
            ? new List<int> { 1, 2, 3, 4 }
            : new List<int> { 1, 2, 3 };

        var roleActual = aprobacion.Responsible.RoleId;
        var indexRolActual = ordenRoles.IndexOf(roleActual);

        if (indexRolActual > 0)
        {
            var rolesPrevios = ordenRoles.Take(indexRolActual).ToList();

            var aprobaciones = await _context.permissionApproval
                .Include(pa => pa.Responsible)
                .Where(pa => pa.PermissionId == idPermiso)
                .ToListAsync();

            var rolesPreviosAprobados = aprobaciones
                .Where(pa => rolesPrevios.Contains(pa.Responsible.RoleId) &&
                            pa.ApprovalStatus == ApprovalStatus.Aprobado)
                .Select(pa => pa.Responsible.RoleId)
                .ToList();

            if (rolesPrevios.Except(rolesPreviosAprobados).Any())
            {
                return "No puede rechazar aún. Debe esperar a que el responsable anterior apruebe o rechace el permiso.";
            }
        }

        // 6. Rechazo válido
        aprobacion.ApprovalStatus = ApprovalStatus.Rechazado;
        aprobacion.ApprovalDate = DateTime.Now;
        permiso.Status = Status.Rechazado;

        await _context.SaveChangesAsync();
        // // 7. Notificar al aprendiz del rechazo
        // var nombreAprendiz = $"{aprendiz.First_Name_Apprentice} {aprendiz.Last_Name_Apprentice}";
        // var emailAprendiz = aprendiz.Email_Apprentice;
        // var nombreRol = ObtenerNombreRol(responsable.RoleId);

        // await GeneralFunction.NotifyRechazoAprendizAsync(emailAprendiz, nombreAprendiz, nombreRol);

        return "Permiso rechazado exitosamente.";
    }


    public object ObtenerPermisosPendientesPorResponsableAsync(int idResponsable)
    {
        var pendientes = _context.permissionApproval
        .Where(pa => pa.ResponsibleId == idResponsable && pa.Permission.Status == Status.Pendiente)
        .Select(pa => new
        {
            pa.Id,
            //aprendiz nom
            pa.Permission.Apprentice.First_Name_Apprentice,
            pa.Permission.Apprentice.Last_Name_Apprentice,
            //permiso
            pa.PermissionId,
            pa.Permission.DepartureDate,
            pa.Permission.EntryDate,
            pa.Permission.Adress,
            pa.Permission.Destination,
            pa.Permission.Motive,
            pa.Permission.Observation,
            pa.Permission.Apprentice.Tip_Apprentice,
            pa.Permission.Apprentice.File_Id,
            pa.Permission.Apprentice.nom_responsible,
            pa.Permission.Apprentice.ape_responsible,
            pa.Permission.Apprentice.tel_responsible,
            id_aprendiz = pa.Permission.Id_Apprentice
        })
        .ToList();

        return pendientes;
    }
}

