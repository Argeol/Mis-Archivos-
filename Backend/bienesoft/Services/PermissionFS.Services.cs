using bienesoft.Models;
using Bienesoft.Models;
using Bienesoft.Services;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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

            return permissions.Select(p => new
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
                ApprenticeInfo = p.Apprentice != null
                    ? _apprenticeService.GetApprenticeById(p.Apprentice_Id)
                    : null
            });
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
                ApprenticeInfo = permission.Apprentice != null
                    ? _apprenticeService.GetApprenticeById(permission.Apprentice_Id)
                    : null
            };
        }

        public async Task<PermissionFS> CreateAsync(PermissionFS model)
        {
            var newPermission = new PermissionFS
            {
                Apprentice_Id = model.Apprentice_Id,
                Destino = model.Destino,
                Fec_Salida = model.Fec_Salida,
                Fec_Entrada = model.Fec_Entrada,
                Dia_Salida = model.Dia_Salida,
                Alojamiento = model.Alojamiento,
                Sen_Empresa = model.Sen_Empresa,
                Direccion = model.Direccion
            };

            _context.permissionFS.Add(newPermission);
            await _context.SaveChangesAsync();
            return newPermission;
        }

        // Cambio: el método Update ahora maneja el modelo completo
        public async Task<PermissionFS> UpdateAsync(int id, PermissionFS model)
        {
            var permission = await _context.permissionFS.FindAsync(id);
            if (permission == null) return null;

            // Actualiza los campos con los datos del modelo recibido
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

            var permisos = await _context.permissionFS.ToListAsync();

            worksheet.Cell(1, 1).Value = "ID";
            worksheet.Cell(1, 2).Value = "Aprendiz";
            worksheet.Cell(1, 3).Value = "Destino";
            worksheet.Cell(1, 5).Value = "Fecha Salida";
            worksheet.Cell(1, 6).Value = "Fecha Entrada";
            worksheet.Cell(1, 7).Value = "Día Salida";
            worksheet.Cell(1, 8).Value = "Alojamiento";
            worksheet.Cell(1, 9).Value = "SENA - Empresa";
            worksheet.Cell(1, 10).Value = "Dirección";
            worksheet.Cell(1, 11).Value = "Total de aprendices que salieron";

            int row = 2;
            foreach (var p in permisos)
            {
                worksheet.Cell(row, 1).Value = p.PermissionFS_Id;
                worksheet.Cell(row, 2).Value = p.Apprentice_Id;
                worksheet.Cell(row, 3).Value = p.Destino;
                worksheet.Cell(row, 5).Value = p.Fec_Salida.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 6).Value = p.Fec_Entrada.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 7).Value = p.Dia_Salida.ToString();
                worksheet.Cell(row, 8).Value = p.Alojamiento;
                worksheet.Cell(row, 9).Value = p.Sen_Empresa.ToString();
                worksheet.Cell(row, 10).Value = p.Direccion;
                row++;
            }

            // Cálculo del total de aprendices que salieron
            int total = await _context.permissionFS
                .Where(p => p.Fec_Salida != null)
                .Select(p => p.Apprentice_Id)
                .Distinct()
                .CountAsync();

            worksheet.Cell(row, 10).Value = "Total:";
            worksheet.Cell(row, 11).Value = total;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}
