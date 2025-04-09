using bienesoft.Models;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
namespace Bienesoft.Services
{
    public class PermissionService
    {
        private readonly AppDbContext _context;
        private readonly ApprenticeService _apprenticeService;

        public PermissionService(AppDbContext context, ApprenticeService apprenticeService)
        {
            _context = context;
            _apprenticeService = apprenticeService;
        }

        public async Task<PermissionGN> CreatePermissionAsync(PermissionGN permission)
        {
            var apprentice = await _context.apprentice.FindAsync(permission.Id_Apprentice);
            if (apprentice == null)
                throw new ArgumentException("El aprendiz no existe.");

            _context.permissionGN.Add(permission);
            await _context.SaveChangesAsync();

            return permission;
        }

        public object GetPermissionById(int id)
        {
            var permiso = _context.permissionGN
                .Include(p => p.Apprentice)
                .FirstOrDefault(p => p.PermissionId == id);

            if (permiso == null) return null;

            return new
            {
                permiso.PermissionId,
                permiso.DepartureDate,
                permiso.EntryDate,
                permiso.ApplicationDate,
                permiso.Adress,
                permiso.Motive,
                permiso.Observation,
                Status = permiso.Status.ToString(),
                Aprendiz = _apprenticeService.GetApprenticeById(permiso.Id_Apprentice)
            };
        }

        public IEnumerable<object> GetAllPermissions()
        {
            return _context.permissionGN
                .Include(p => p.Apprentice)
                .Select(p => new
                {
                    p.PermissionId,
                    p.Motive,
                    Fechadesolicitud = p.ApplicationDate.ToString("HH:mm yyyy-MM-dd"),
                    Fechalsalida = p.DepartureDate.ToString("HH:mm yyyy-MM-dd"),
                    Fechallegada = p.EntryDate.ToString("HH:mm yyyy-MM-dd"),
                    Estado = p.Status.ToString(),
                    NombreAprendiz = p.Apprentice.First_Name_Apprentice + " " + p.Apprentice.Last_Name_Apprentice,
                    p.Id_Apprentice
                })
                .ToList();
        }

        // public async Task<bool> DeletePermissionAsync(int id)
        // {
        //     var permission = await _context.permissionGN.FindAsync(id);
        //     if (permission == null)
        //         return false;

        //     _context.permissionGN.Remove(permission);
        //     await _context.SaveChangesAsync();
        //     return true;
        // }
        public byte[] ExportApprovedPermissionsToExcel()
        {
            var permisos = _context.permissionGN
                .Include(p => p.Apprentice)
                .Where(p => p.Status == Status.Aprobado)
                .Select(p => new
                {
                    p.PermissionId,
                    p.Motive,
                    p.DepartureDate,
                    p.EntryDate,
                    Estado = p.Status.ToString(),
                    NombreAprendiz = p.Apprentice.First_Name_Apprentice + " " + p.Apprentice.Last_Name_Apprentice
                })
                .ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Permisos Aprobados");

                worksheet.Cell(1, 1).Value = "ID";
                worksheet.Cell(1, 2).Value = "Motivo";
                worksheet.Cell(1, 3).Value = "Fecha Salida";
                worksheet.Cell(1, 4).Value = "Fecha Entrada";
                worksheet.Cell(1, 5).Value = "Estado";
                worksheet.Cell(1, 6).Value = "Aprendiz";

                for (int i = 0; i < permisos.Count; i++)
                {
                    var p = permisos[i];
                    worksheet.Cell(i + 2, 1).Value = p.PermissionId;
                    worksheet.Cell(i + 2, 2).Value = p.Motive;
                    worksheet.Cell(i + 2, 3).Value = p.DepartureDate;
                    worksheet.Cell(i + 2, 4).Value = p.EntryDate;
                    worksheet.Cell(i + 2, 5).Value = p.Estado;
                    worksheet.Cell(i + 2, 6).Value = p.NombreAprendiz;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    return stream.ToArray();
                }
            }
        }
        public async Task<object> UpdatePermissionAsync(int id, PermissionGN updatedPermiso)
        {
            var permiso = await _context.permissionGN
                .Include(p => p.Approvals)
                .FirstOrDefaultAsync(p => p.PermissionId == id);

            if (permiso == null)
                return new { success = false, message = "Permiso no encontrado." };

            // Verificar si ya hay alguna aprobación que no sea Pendiente
            bool yaFueAprobado = permiso.Approvals.Any(a =>
                a.ApprovalStatus == ApprovalStatus.Aprobado || a.ApprovalStatus == ApprovalStatus.Rechazado);

            if (yaFueAprobado)
                return new { success = false, message = "No se puede actualizar el permiso, ya fue aprobado o rechazado por un responsable." };

            // Actualizar campos
            permiso.DepartureDate = updatedPermiso.DepartureDate;
            permiso.EntryDate = updatedPermiso.EntryDate;
            permiso.Adress = updatedPermiso.Adress;
            permiso.Destination = updatedPermiso.Destination;
            permiso.Motive = updatedPermiso.Motive;
            permiso.Observation = updatedPermiso.Observation;

            _context.permissionGN.Update(permiso);
            await _context.SaveChangesAsync();

            return new { success = true, message = "Permiso actualizado correctamente." };
        }

    }
}
