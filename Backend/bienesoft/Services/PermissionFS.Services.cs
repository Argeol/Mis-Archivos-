using bienesoft.Models;
using Bienesoft.Models;
using Bienesoft.Services;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

namespace bienesoft.Services
{
    public class PermissionFSService
    {
        private readonly AppDbContext _context;
        private readonly ApprenticeService _apprenticeService;

        public PermissionFSService(AppDbContext context, ApprenticeService apprenticeService)
        {
            _context = context;
            _apprenticeService = apprenticeService;
        }

        public async Task<IEnumerable<object>> GetAllAsync()
        {
            var permissions = await _context.permissionFS
                .Include(p => p.Apprentice)
                .ToListAsync();

            var result = permissions.Select(p => new
            {
                p.PermissionFS_Id,
                p.Apprentice_Id,
                p.Destino,
                p.Fec_Salida,
                p.Fec_Entrada,
                p.Dia_Salida,
                p.Alojamiento,
                p.Sen_Empresa,
                p.Direccion,
                ApprenticeInfo = p.Apprentice?.First_Name_Apprentice + p.Apprentice?.Last_Name_Apprentice 
            });

            return result;
        }

        public async Task<object> GetByIdAsync(int id)
        {
            var permission = await _context.permissionFS
                .Include(p => p.Apprentice)
                .FirstOrDefaultAsync(p => p.PermissionFS_Id == id);

            if (permission == null) return null;

            return new
            {
                permission.PermissionFS_Id,
                permission.Apprentice_Id,
                permission.Destino,
                permission.Fec_Salida,
                permission.Fec_Entrada,
                permission.Dia_Salida,
                permission.Alojamiento,
                permission.Sen_Empresa,
                permission.Direccion,
                ApprenticeInfo = permission.Apprentice
            };
        }

        public async Task<PermissionFS> CreateAsync(PermissionFS model)
        {
            model.Fec_Diligenciado = DateTime.Today;
            await _context.permissionFS.AddAsync(model);
            await _context.SaveChangesAsync();
            return model;
        }

        // ✔ Versión que usa el Id_Apprentice desde el controlador
        public async Task<PermissionFS> CreateAsync(PermissionFS model, int idApprentice)
        {
            // Asignar el aprendiz al modelo antes de guardarlo
            model.Apprentice_Id = idApprentice;
            model.Fec_Diligenciado = DateTime.Today;    

            await _context.permissionFS.AddAsync(model);
            await _context.SaveChangesAsync();

            // Si tienes que procesar responsablesSeleccionados, lo haces aquí
            // Por ahora se deja como pendiente si no hay tabla intermedia

            return model;
        }




        public async Task<PermissionFS> UpdateAsync(int id, PermissionFS model)
        {
            var permission = await _context.permissionFS.FindAsync(id);
            if (permission == null) return null;

            permission.Destino = model.Destino;
            permission.Fec_Salida = model.Fec_Salida;
            permission.Fec_Entrada = model.Fec_Entrada;
            permission.Dia_Salida = model.Dia_Salida;
            permission.Alojamiento = model.Alojamiento;
            permission.Sen_Empresa = model.Sen_Empresa;
            permission.Direccion = model.Direccion;

            await _context.SaveChangesAsync();
            return permission;
        }

        public async Task<byte[]> ExportToExcelAsync()
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Permisos");

            var permisos = await _context.permissionFS
                .Include(p => p.Apprentice)
                    .ThenInclude(a => a.File)
                        .ThenInclude(f => f.program)
                .ToListAsync();

            // Encabezados
            worksheet.Cell(1, 1).Value = "Documento Aprendiz";
            worksheet.Cell(1, 2).Value = "Nombre y Apellido";
            worksheet.Cell(1, 3).Value = "Destino";
            worksheet.Cell(1, 4).Value = "Programa de Formación";
            worksheet.Cell(1, 5).Value = "Número de Ficha";
            worksheet.Cell(1, 6).Value = "Teléfono";
            worksheet.Cell(1, 7).Value = "Nombre de Acudiente";
            worksheet.Cell(1, 8).Value = "Teléfono de Acudiente";
            worksheet.Cell(1, 9).Value = "Fecha Salida";
            worksheet.Cell(1, 10).Value = "Fecha Entrada";
            worksheet.Cell(1, 11).Value = "Día Salida";
            worksheet.Cell(1, 12).Value = "Alojamiento";
            worksheet.Cell(1, 13).Value = "SENA - Empresa";
            worksheet.Cell(1, 14).Value = "Dirección";
            worksheet.Cell(1, 15).Value = "Total de aprendices que salieron";

            int row = 2;
            foreach (var p in permisos)
            {
                var apprentice = p.Apprentice;
                string fullName = apprentice?.First_Name_Apprentice + " " + apprentice?.Last_Name_Apprentice;

                worksheet.Cell(row, 1).Value = p.Apprentice_Id;
                worksheet.Cell(row, 2).Value = fullName;
                worksheet.Cell(row, 3).Value = p.Destino;
                worksheet.Cell(row, 4).Value = apprentice?.File?.program?.Program_Name;
                worksheet.Cell(row, 5).Value = apprentice?.File?.File_Id;
                worksheet.Cell(row, 6).Value = apprentice?.Phone_Apprentice;
                worksheet.Cell(row, 7).Value = apprentice?.nom_responsible;
                worksheet.Cell(row, 8).Value = apprentice?.tel_responsible;
                worksheet.Cell(row, 9).Value = p.Fec_Salida?.ToString("yyyy-MM-dd") ?? "";
                worksheet.Cell(row, 10).Value = p.Fec_Entrada?.ToString("yyyy-MM-dd") ?? "";
                worksheet.Cell(row, 11).Value = p.Dia_Salida.ToString();
                worksheet.Cell(row, 12).Value = p.Alojamiento;
                worksheet.Cell(row, 13).Value = p.Sen_Empresa.ToString();
                worksheet.Cell(row, 14).Value = p.Direccion;
                row++;
            }

            int total = await _context.permissionFS
                .Where(p => p.Fec_Salida != null)
                .Select(p => p.Apprentice_Id)
                .Distinct()
                .CountAsync();

            worksheet.Cell(row, 14).Value = "Total:";
            worksheet.Cell(row, 15).Value = total;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        public async Task<IEnumerable<object>> GetPermisosFSDeAprendizAsync(int apprenticeId)
        {
            var permisos = await _context.permissionFS
                .Where(p => p.Apprentice_Id == apprenticeId)
                .OrderByDescending(p => p.Fec_Salida)
                .Select(p => new
                {
                    DiaSalida = p.Dia_Salida,
                    FechaSalida = p.Fec_Salida != null ? p.Fec_Salida.Value.ToString("yyyy-MM-dd") : ""
                })
                .ToListAsync();

            return permisos;
        }
    }
}
