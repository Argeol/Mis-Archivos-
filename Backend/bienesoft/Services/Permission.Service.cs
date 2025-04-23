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
        // public async Task<object> CreatePermissionAsync(PermissionGN permission, List<int> responsablesSeleccionados)
        // {
        //     // Verificar si el aprendiz existe
        //     var apprentice = await _context.apprentice.FindAsync(permission.Id_Apprentice);
        //     if (apprentice == null)
        //     {
        //         return new
        //         {
        //             Success = false,
        //             Message = "El aprendiz no existe."
        //         };
        //     }

        //     // Verificar si el aprendiz es interno o externo
        //     bool esInterno = apprentice.Tip_Apprentice == "interno";

        //     // Determinar los roles necesarios
        //     List<int> rolesRequeridos = esInterno
        //         ? new List<int> { 1, 2, 3, 4 } // Incluir rol de Internado
        //         : new List<int> { 1, 2, 3 };    // Solo Instructor, Coordinador, Bienestar

        //     // Verificar que se hayan seleccionado los roles correctos
        //     var rolesSeleccionados = responsablesSeleccionados.Distinct().ToList();
        //     if (esInterno && rolesSeleccionados.Count != 4)
        //     {
        //         return new
        //         {
        //             Success = false,
        //             Message = "Faltan responsables para el permiso. Como es un aprendiz interno, debe seleccionar 4 responsables."
        //         };
        //     }

        //     // Verificar que todos los roles requeridos estén seleccionados
        //     if (!rolesRequeridos.All(role => rolesSeleccionados.Contains(role)))
        //     {
        //         return new
        //         {
        //             Success = false,
        //             Message = "Faltan roles por seleccionar. Asegúrese de seleccionar los responsables correctos."
        //         };
        //     }

        //     // Registrar el permiso
        //     _context.permissionGN.Add(permission);
        //     await _context.SaveChangesAsync();

        //     // Ahora agregar las aprobaciones para los responsables seleccionados
        //     foreach (var responsibleId in responsablesSeleccionados)
        //     {
        //         _context.permissionApproval.Add(new PermissionApproval
        //         {
        //             PermissionId = permission.PermissionId,
        //             ResponsibleId = responsibleId,
        //             ApprovalStatus = ApprovalStatus.Pendiente // Estado inicial de la aprobación
        //         });
        //     }

        //     // Guardar cambios después de agregar las aprobaciones
        //     await _context.SaveChangesAsync();

        //     return new
        //     {
        //         Success = true,
        //         Message = "Permiso creado con éxito.",
        //         Data = permission // Puedes devolver cualquier tipo de datos, en este caso el permiso
        //     };
        // }


        public object GetPermissionById(int id)
        {
            var permiso = _context.permissionGN
                // .Include(p => p.Apprentice)
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
                // Aprendiz = _apprenticeService.GetApprenticeById(permiso.Id_Apprentice)
            };
        }

        //public IEnumerable<object> GetAllPermissions()
        //{
        //    return _context.permissionGN
        //        .Include(p => p.Apprentic)
        //        .Select(p => new
        //        {
        //            p.PermissionId,
        //            p.Motive,
        //            Fechadesolicitud = p.ApplicationDate.ToString("HH:mm yyyy-MM-dd"),
        //            Fechalsalida = p.DepartureDate.ToString("HH:mm yyyy-MM-dd"),
        //            Fechallegada = p.EntryDate.ToString("HH:mm yyyy-MM-dd"),
        //            Estado = p.Status.ToString(),
        //            NombreAprendiz = p.Apprentice.First_Name_Apprentice + " " + p.Apprentice.Last_Name_Apprentice,
        //            p.Id_Apprentice
        //        })
        //        .ToList();
        //}
        public IEnumerable<object> GetAllPermissions()
        {
            var permisos = _context.permissionGN
                .Include(a => a.Apprentice)
                .Include(p => p.Approvals)
                .ToList(); // <-- Ejecuta la consulta y trae los datos a memoria

            var resultado = permisos.Select(p => new
            {
                p.PermissionId,
                p.Motive,
                Fechadesolicitud = p.ApplicationDate.ToString("yyyy-MM-dd"),
                Fechalsalida = p.DepartureDate.ToString("HH:mm yyyy-MM-dd"),
                Fechallegada = p.EntryDate.ToString("HH:mm yyyy-MM-dd"),
                Estado = p.Status.ToString(),
                NombreAprendiz = p.Apprentice.First_Name_Apprentice + " " + p.Apprentice.Last_Name_Apprentice,
                p.Id_Apprentice,
                Porcentaje = CalcularPorcentajeAprobacion(p)
            });

            return resultado;
        }

        private static double CalcularPorcentajeAprobacion(PermissionGN permiso)
        {
            if (permiso == null || permiso.Approvals == null || permiso.Approvals.Count == 0)
                return 0;

            string tipoAprendiz = permiso.Apprentice?.Tip_Apprentice?.ToLower();
            int totalResponsables = tipoAprendiz == "interno" ? 4 : 3;
            int aprobados = permiso.Approvals.Count(pa => pa.ApprovalStatus == ApprovalStatus.Aprobado);

            double porcentaje = (double)aprobados / totalResponsables * 100;
            return Math.Min(porcentaje, 100);

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
        public async Task<object> UpdatePermissionAsync(int id, UpdatePermiso updatedPermiso)
        {
            var permiso = await _context.permissionGN
                .Include(p => p.Approvals)
                .FirstOrDefaultAsync(p => p.PermissionId == id);

            if (permiso == null)
                return new { success = false, message = "Permiso no encontrado." };

            // Verificar si ya fue aprobado o rechazado
            bool yaFueAprobado = permiso.Approvals.Any(a =>
                a.ApprovalStatus == ApprovalStatus.Aprobado || a.ApprovalStatus == ApprovalStatus.Rechazado);

            if (yaFueAprobado)
                return new { success = false, message = "No se puede actualizar el permiso, ya fue aprobado o rechazado por un responsable." };

            // Validar y actualizar solo si el campo tiene un valor distinto de vacío, null o 0
            if (updatedPermiso.DepartureDate.HasValue && updatedPermiso.DepartureDate.Value != default)
                permiso.DepartureDate = updatedPermiso.DepartureDate.Value;

            if (updatedPermiso.EntryDate.HasValue && updatedPermiso.EntryDate.Value != default)
                permiso.EntryDate = updatedPermiso.EntryDate.Value;

            if (!string.IsNullOrWhiteSpace(updatedPermiso.Adress))
                permiso.Adress = updatedPermiso.Adress;

            if (!string.IsNullOrWhiteSpace(updatedPermiso.Destination))
                permiso.Destination = updatedPermiso.Destination;

            if (!string.IsNullOrWhiteSpace(updatedPermiso.Motive))
                permiso.Motive = updatedPermiso.Motive;

            if (!string.IsNullOrWhiteSpace(updatedPermiso.Observation))
                permiso.Observation = updatedPermiso.Observation;

            _context.permissionGN.Update(permiso);
            await _context.SaveChangesAsync();

            return new { success = true, message = "Permiso actualizado correctamente." };
        }

        // public async Task<object> GetApprenticePermission(int id, PermissionGN permissionGN)
        // {
        //    var permisos = await _context.permissionGN
        //     .Where(p => p.Id_Apprentice == id)
        //     .Include(p=> p

        //     return permiso;


        // }

    }
}
