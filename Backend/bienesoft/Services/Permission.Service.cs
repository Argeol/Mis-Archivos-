using bienesoft.Funcions;
using bienesoft.models;
using bienesoft.Models;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
namespace Bienesoft.Services
{
    public class PermissionService
    {
        private readonly AppDbContext _context;
        private readonly ApprenticeService _apprenticeService;
        private readonly IConfiguration _configuration;
        public GeneralFunction generalFunction;




        public PermissionService(IConfiguration configuration, AppDbContext context, ApprenticeService apprenticeService)
        {
            _context = context;
            _apprenticeService = apprenticeService;
            _configuration = configuration;
        }
        public async Task<string> CreatePermissionAsync(PermissionGN permissionGN, int idApprentice, List<int> responsablesOrdenados)
        {

            var permisoPendiente = await _context.permissionGN
                .FirstOrDefaultAsync(p => p.Id_Apprentice == idApprentice && p.Status == Status.Pendiente);

            if (permisoPendiente != null)
                return "Ya hay un permiso pendiente para este aprendiz.";

            permissionGN.Id_Apprentice = idApprentice;
            permissionGN.Status = Status.Pendiente;

            _context.permissionGN.Add(permissionGN);
            await _context.SaveChangesAsync();

            var aprobaciones = responsablesOrdenados.Select(responsableId => new PermissionApproval
            {
                PermissionId = permissionGN.PermissionId,
                ResponsibleId = responsableId,
                ApprovalStatus = ApprovalStatus.Pendiente,
                ApprovalDate = null
            }).ToList();

            _context.permissionApproval.AddRange(aprobaciones);
            await _context.SaveChangesAsync();

            // Notificar al primer responsable
            var primerResponsableId = responsablesOrdenados.First();
            var primerResponsable = await _context.responsible
                .Include(r => r.Role)
                .FirstOrDefaultAsync(r => r.RoleId == primerResponsableId);

            var aprendiz = await _context.apprentice.FindAsync(idApprentice);

            if (primerResponsable != null && aprendiz != null)
            {
                var email = primerResponsable.Email_Responsible;
                var nombreRol = primerResponsable.Role.Name_role;
                var nombreAprendiz = $"{aprendiz.First_Name_Apprentice} {aprendiz.Last_Name_Apprentice}";

                await generalFunction.NotifyResponsibleAsync(email, nombreRol, nombreAprendiz);
            }

            return "Permiso creado con responsables asignados.";
        }





        public object GetPermissionById(int id)
        {
            var permiso = _context.permissionGN

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

        public async Task<object> ObtenerResumenPermisosAsync()
        {
            var hoy = DateTime.Today;
            var inicioSemana = hoy.AddDays(-(int)hoy.DayOfWeek + (int)DayOfWeek.Monday);
            var inicioMes = new DateTime(hoy.Year, hoy.Month, 1);

            var permisosPendientes = await _context.permissionGN
                .Where(p => p.Status == Status.Pendiente)
                .CountAsync();

            var permisosAprobadosActivos = await _context.permissionGN
                .Where(p =>
                    p.Status == Status.Aprobado &&
                    p.DepartureDate <= hoy &&
                    p.EntryDate >= hoy
                )
                .CountAsync();

            // Conteos por fecha de diligenciamiento (ApplicationDate)
            var diligenciadosHoy = await _context.permissionGN
                .Where(p => p.ApplicationDate.Date == hoy)
                .CountAsync();

            var diligenciadosSemana = await _context.permissionGN
                .Where(p => p.ApplicationDate.Date >= inicioSemana)
                .CountAsync();

            var diligenciadosMes = await _context.permissionGN
                .Where(p => p.ApplicationDate.Date >= inicioMes)
                .CountAsync();

            return new
            {
                pendientes = permisosPendientes,
                aprobadosActivos = permisosAprobadosActivos,
                PermisosHoy = diligenciadosHoy,
                PermisosSemana = diligenciadosSemana,
                PermisosMes = diligenciadosMes
            };
        }

        public IEnumerable<object> GetAllPermissions()
        {
            var permisos = _context.permissionGN
                .Include(p => p.Approvals);
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

        // // para traer permisos por id de ficha 
        // public async Task<List<object>> GetPermissionsByFileIdAsync(int fileId)
        // {
        //     var permissions = await _context.permissionGN
        //         .Where(p => p.Apprentice.File_Id == fileId)
        //         .Select(p => new
        //         {
        //             p.PermissionId,
        //             p.Id_Apprentice,
        //             ApprenticeFullName = p.Apprentice.First_Name_Apprentice + " " + p.Apprentice.Last_Name_Apprentice,
        //             p.DepartureDate,
        //             p.EntryDate,
        //             p.ApplicationDate,
        //             p.Motive,
        //             p.Observation,
        //             p.Status
        //         })
        //         .ToListAsync();
        //     return permissions.Cast<object>().ToList();
        // }
        // exportacion por id de ficha 
        public async Task<byte[]> ExportPermissionsByFileIdAsync(int fileId)
        {
            var permissions = await _context.permissionGN
                .Where(p => p.Apprentice.File_Id == fileId)
                .Select(p => new
                {
                    p.PermissionId,
                    p.Id_Apprentice,
                    ApprenticeFullName = p.Apprentice.First_Name_Apprentice + " " + p.Apprentice.Last_Name_Apprentice,
                    p.DepartureDate,
                    p.EntryDate,
                    p.ApplicationDate,
                    p.Motive,
                    p.Observation,
                    p.Status
                })
                .ToListAsync();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Permisos");

            // Cabeceras
            // worksheet.Cell(1, 1).Value = "ID Permiso";
            worksheet.Cell(1, 2).Value = "Documento Aprendiz";
            worksheet.Cell(1, 3).Value = "Nombre Completo";
            worksheet.Cell(1, 4).Value = "Fecha de Salida";
            worksheet.Cell(1, 5).Value = "Fecha de Entrada";
            worksheet.Cell(1, 6).Value = "Fecha de Solicitud";
            worksheet.Cell(1, 7).Value = "Motivo";
            worksheet.Cell(1, 8).Value = "Observación";
            worksheet.Cell(1, 9).Value = "Estado";

            // Cuerpo
            int row = 2;
            foreach (var p in permissions)
            {
                // worksheet.Cell(row, 1).Value = p.PermissionId;
                worksheet.Cell(row, 2).Value = p.Id_Apprentice;
                worksheet.Cell(row, 3).Value = p.ApprenticeFullName;
                worksheet.Cell(row, 4).Value = p.DepartureDate.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 5).Value = p.EntryDate.ToString("yyyy-MM-dd"); // si es nullable
                worksheet.Cell(row, 6).Value = p.ApplicationDate.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 7).Value = p.Motive.ToString();
                worksheet.Cell(row, 8).Value = p.Observation.ToString();
                worksheet.Cell(row, 9).Value = p.Status.ToString();
                row++;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }


        public async Task<IEnumerable<object>> GetPermissionsByApprenticeId(int apprenticeId)
        {
            var permisos = await _context.permissionGN
                .Include(p => p.Approvals)
                .Where(p => p.Id_Apprentice == apprenticeId)
                .Select(permiso => new
                {
                    permiso.PermissionId,
                    permiso.DepartureDate, // Fecha de salida   
                    permiso.EntryDate, // Fecha de entrada
                    permiso.ApplicationDate, // Fecha de solicitud
                    permiso.Adress, // Dirección
                    permiso.Motive, // Motivo
                    permiso.Observation, // Observación 
                    Status = permiso.Status.ToString(), // Estado
                    Porcentaje = CalcularPorcentajeAprobacion(permiso) // Porcentaje de aprobación)
                })
                .ToListAsync();

            return permisos;
        }
        public async Task<string> EliminarPermisoPorAprendizAsync(int idPermiso, int idAprendiz)
        {
            var permiso = await _context.permissionGN
                .FirstOrDefaultAsync(p => p.PermissionId == idPermiso && p.Id_Apprentice == idAprendiz);

            if (permiso == null)
                return "Permiso no encontrado o no pertenece al aprendiz.";

            if (permiso.Status != Status.Pendiente)
                return "Solo se pueden eliminar permisos en estado Pendiente.";

            // Eliminar todas las aprobaciones relacionadas con ese permiso
            var aprobaciones = await _context.permissionApproval
                .Where(pa => pa.PermissionId == idPermiso)
                .ToListAsync();

            _context.permissionApproval.RemoveRange(aprobaciones);
            _context.permissionGN.Remove(permiso);

            await _context.SaveChangesAsync();

            return "Permiso y todas sus aprobaciones eliminados exitosamente.";
        }

    }
}
