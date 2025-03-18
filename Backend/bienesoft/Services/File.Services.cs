using bienesoft.Models;
using Bienesoft.Models;
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
        public IEnumerable<object> Getfiles()
        {
            return _context.file.Include(f => f.program).Select(a => new
            {
                a.File_Id,
                a.Apprentice_count,
                a.End_Date,
                a.Start_Date,
                a.program.Program_Name

  
            }).ToList();
        }
        public void AddFile(FileModel file)
        {
            _context.file.Add(file);
            _context.SaveChanges();
        }
        public object GetFileById(int id)
        {
            var file = _context.file
                .Include(f => f.program)
                .Where(f => f.File_Id == id)
                .Select(a => new
                {
                    a.File_Id,
                    a.Apprentice_count,
                    a.End_Date,
                    a.Start_Date,
                    a.program.Program_Name
                })
                .FirstOrDefault();

            return file;
        }

        public void Delete(int id)
        {
            var file = _context.file.FirstOrDefault(p => p.File_Id == id);
            if (file != null)
            {
                try
                {
                    _context.file.Remove(file);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw new Exception("No Se Pudo Eliminar La File" + ex.Message);
                }
            }
            else
            {
                throw new KeyNotFoundException("La File Con El Id" + id + "No Se Pudo Encontrar");
            }
        }
        //public void UpdateFile(FileModel file)
        //{
        //    if (file == null)
        //    {
        //        throw new ArgumentNullException(nameof(FileModel), "El modelo de File es nulo");
        //    }

        //    var existingFileModel = _context.file.Find(file.File_Id);
        //    if (existingFileModel == null)
        //    {
        //        throw new ArgumentException("File no encontrado");
        //    }

        //    existingFileModel.File_Id = file.File_Id;
        //    existingFileModel.File_Name = file.

        //    // Actualiza otros campos según sea necesario

        //    _context.SaveChanges();

        //}
        public async Task<FileModel?> UpdateFileAsync(FileModel updatedFile)
        {
            var existingFile = await _context.file.FindAsync(updatedFile.File_Id);

            if (existingFile == null)
            {
                return null; // No se encontró el registro
            }

            // Actualizar los campos manualmente
            existingFile.Apprentice_count = updatedFile.Apprentice_count;
            existingFile.Start_Date = updatedFile.Start_Date;
            existingFile.End_Date = updatedFile.End_Date;
            existingFile.Program_Id = updatedFile.Program_Id;

            // Si quieres actualizar la colección Apprentice, puedes hacerlo aquí si es necesario
            // Nota: Esto depende de cómo gestiones las relaciones y si deseas reemplazar la colección completa.
            // existingFile.Apprentice = updatedFile.Apprentice;

            // EF Core detecta los cambios si la entidad está siendo trackeada (como aquí)
            await _context.SaveChangesAsync();

            return existingFile;
        }

    }
}
