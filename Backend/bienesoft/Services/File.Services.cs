using bienesoft.Models;
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

    }

}
