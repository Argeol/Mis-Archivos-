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
        public IEnumerable<FileModel> Getfile()
        {
            return _context.file.Include(p=> p.program).ToList();
        }
        public void AddFile(FileModel file)
        {
            _context.file.Add(file);
            _context.SaveChanges();
        }
        public FileModel GetById(int id)
        {
            return _context.file.FirstOrDefault(p => p.File_Id == id);
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
        public void UpdateFile(FileModel file)
        {
            if (file == null)
            {
                throw new ArgumentNullException(nameof(FileModel), "El modelo de File es nulo");
            }

            var existingFileModel = _context.file.Find(file.File_Id);
            if (existingFileModel == null)
            {
                throw new ArgumentException("File no encontrado");
            }

            existingFileModel.File_Id = file.File_Id;
            // Actualiza otros campos según sea necesario

            _context.SaveChanges();
        }
    }
}
