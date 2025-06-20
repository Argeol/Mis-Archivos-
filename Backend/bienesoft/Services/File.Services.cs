using bienesoft.Models;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

namespace bienesoft.Services
{
    public class FileServices
    {
        private readonly AppDbContext _context;
        public FileServices(AppDbContext context)
        {
            _context = context;
        }
        //public IEnumerable<FileModel> Getfile()
        //{
        //    return _context.file.Include(p=> p.program).ToList();
        //}
        public async Task<List<object>> GetFilesAsync()
        {
            var files = await _context.file
                .Include(f => f.program)
                    .ThenInclude(p => p.Area)
                .Select(f => new
                {
                    f.File_Id,
                    f.Program_Id,
                    f.Apprentice_count,
                    f.Start_Date,
                    f.End_Date,
                    ProgramName = f.program != null ? f.program.Program_Name : "No asignado",
                    f.program.Area.Area_Name,
                    Status = (f.End_Date.HasValue && f.End_Date.Value < DateTime.Now) ? "Expirado" : "Activo",
                })
                .ToListAsync();

            return files.Cast<object>().ToList(); // Se convierte a List<object> para retornar
        }
        public async Task AddFileAsync(FileModel file)
        {
            _context.file.Add(file);
            await _context.SaveChangesAsync();
        }
        public object GetFileById(int id)
        {
            var file = _context.file
                .Include(f => f.program)
                .Where(f => f.File_Id == id)
                .Select(a => new
                {
                    a.File_Id,
                    a.Program_Id,
                    a.Apprentice_count,
                    a.End_Date,
                    a.Start_Date,
                    a.program.Program_Name,
                    a.program.Area.Area_Name
                })
                .FirstOrDefault();

            return file;
        }

        public async Task<FileModel?> UpdateFileAsync(int Id, FileModel updatedFile)
        {
            var existingFile = await _context.file.FindAsync(Id);

            if (existingFile == null)
            {
                return null; // No se encontró el registro
            }

            // Solo actualiza los valores si se proporcionan
            if (updatedFile.Apprentice_count != 0)
                existingFile.Apprentice_count = updatedFile.Apprentice_count;

            if (updatedFile.Start_Date.HasValue)
                existingFile.Start_Date = updatedFile.Start_Date.Value;

            if (updatedFile.End_Date.HasValue)
                existingFile.End_Date = updatedFile.End_Date.Value;

            if (updatedFile.Program_Id != 0)
                existingFile.Program_Id = updatedFile.Program_Id;

            await _context.SaveChangesAsync();

            return existingFile;
        }
        public async Task<List<FileModel?>> GetFileProgramAsync(int programId)
        {
            return await _context.file
                .Include(a => a.program)
                .Where(m => m.Program_Id == programId)
                .ToListAsync();
        }
        public async Task<int> DesactivarAprendicesPorFichasFinalizadasAsync()
        {
            var hoy = DateTime.Today;

            // Buscar fichas que ya terminaron
            var fichasFinalizadas = await _context.file
                .Where(f => f.End_Date <= hoy)
                .Select(f => f.File_Id)
                .ToListAsync();

            if (!fichasFinalizadas.Any())
                return 0;

            // Buscar aprendices activos que pertenecen a esas fichas
            var aprendices = await _context.apprentice
            .Where(a => fichasFinalizadas.Contains(a.File_Id)
                    && a.Status_Apprentice == "Activo")
            .ToListAsync();
            foreach (var a in aprendices)
            {
                a.Status_Apprentice = "Inactivo";
            }

            await _context.SaveChangesAsync();

            return aprendices.Count;
        }
        // public async Task<MemoryStream> ExportFilesToExcelAsync()
        // {
        //     var files = await _context.file
        //         .Include(f => f.program)
        //         .ToListAsync();

        //     var workbook = new XLWorkbook();
        //     var worksheet = workbook.Worksheets.Add("Fichas");

        //     // Encabezados
        //     worksheet.Cell(1, 1).Value = "ID Ficha";
        //     worksheet.Cell(1, 2).Value = "Cantidad Aprendices";
        //     worksheet.Cell(1, 3).Value = "Fecha Inicio";
        //     worksheet.Cell(1, 4).Value = "Fecha Fin";
        //     worksheet.Cell(1, 5).Value = "Programa";
        //     worksheet.Cell(1, 6).Value = "Estado";

        //     int row = 2;
        //     foreach (var file in files)
        //     {
        //         worksheet.Cell(row, 1).Value = file.File_Id;
        //         worksheet.Cell(row, 2).Value = file.Apprentice_count;
        //         worksheet.Cell(row, 3).Value = file.Start_Date?.ToString("yyyy-MM-dd") ?? "N/A";
        //         worksheet.Cell(row, 4).Value = file.End_Date?.ToString("yyyy-MM-dd") ?? "N/A";
        //         worksheet.Cell(row, 5).Value = file.program?.Program_Id ?? "N/A";
        //         worksheet.Cell(row, 6).Value = file.Status;
        //         row++;
        //     }

        //     var stream = new MemoryStream();
        //     workbook.SaveAs(stream);
        //     stream.Position = 0;
        //     return stream;
        // }
        public async Task<object> ImportFilesAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1); // o usa el nombre de la hoja si lo sabes

            var rows = worksheet.RangeUsed().RowsUsed().Skip(1); // Omitimos la cabecera

            var added = new List<FileModel>();
            var notFoundPrograms = new List<string>();

            foreach (var row in rows)
            {
                var fichaId = row.Cell(1).GetValue<int>();
                var programName = row.Cell(2).GetString().Trim();
                var cantidad = row.Cell(3).GetValue<int>();

                // Buscar el programa por nombre
                var program = await _context.program
                    .FirstOrDefaultAsync(p => p.Program_Name.Trim().ToUpper() == programName.ToUpper());

                if (program == null)
                {
                    notFoundPrograms.Add(programName);
                    continue;
                }

                // Evitar fichas duplicadas
                if (_context.file.Any(f => f.File_Id == fichaId)) continue;

                var ficha = new FileModel
                {
                    File_Id = fichaId,
                    Program_Id = program.Program_Id,
                    Apprentice_count = cantidad
                };

                _context.file.Add(ficha);
                added.Add(ficha);
            }

            await _context.SaveChangesAsync();

            return new
            {
                message = $"Se importaron {added.Count} fichas exitosamente.",
                programasNoEncontrados = notFoundPrograms.Distinct().ToList()
            };
        }
        public static string NormalizarTexto(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "";

            var normalized = input.Normalize(System.Text.NormalizationForm.FormD);
            var sinTildes = new string(normalized
                .Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark)
                .ToArray());

            return sinTildes.ToUpper().Trim();
        }

        public async Task<int> UppercaseMunicipalitiesAsync()
        {
            var municipios = await _context.municipality.ToListAsync();

            foreach (var m in municipios)
            {
                m.municipality = NormalizarTexto(m.municipality);
            }

            return await _context.SaveChangesAsync(); // Devuelve la cantidad de registros modificados
        }


        public async Task<int> UppercaseDepartmentsAsync()
        {
            var departamentos = await _context.department.ToListAsync();

            foreach (var d in departamentos)
            {
                d.Name_department = d.Name_department?.Trim().ToUpper();
            }

            return await _context.SaveChangesAsync();
        }


        //este se elimina ya que es de update fichas 

        public async Task<object> UpdateFechasFichasAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1); // primera hoja
            var rows = worksheet.RangeUsed().RowsUsed().Skip(1); // omitimos la cabecera

            var updated = new List<int>();
            var notFound = new List<int>();

            foreach (var row in rows)
            {
                var fichaId = row.Cell(1).GetValue<int>();
                var fechaInicio = row.Cell(2).GetDateTime();
                var fechaFin = row.Cell(3).GetDateTime();

                var ficha = await _context.file.FirstOrDefaultAsync(f => f.File_Id == fichaId);

                if (ficha != null)
                {
                    ficha.Start_Date = fechaInicio;
                    ficha.End_Date = fechaFin;
                    updated.Add(fichaId);
                }
                else
                {
                    notFound.Add(fichaId);
                }
            }

            await _context.SaveChangesAsync();

            return new
            {
                message = $"Se actualizaron {updated.Count} fichas exitosamente.",
                fichasNoEncontradas = notFound
            };
        }

    }
}

