﻿using bienesoft.Models;
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
        public async Task<List<object>> GetFilesAsync()
        {
            var files = await _context.file
                .Include(f => f.program)
                    .ThenInclude(p=>p.Area)
                .Include(f => f.Apprentice)
                .Select(f => new
                {
                    f.File_Id,
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
                    a.program.Program_Name,
                    a.program.Area.Area_Name
                })
                .FirstOrDefault();

            return file;
        }

        //public void Delete(int id)
        //{
        //    var file = _context.file.FirstOrDefault(p => p.File_Id == id);
        //    if (file != null)
        //    {
        //        try
        //        {
        //            _context.file.Remove(file);
        //            _context.SaveChanges();
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new Exception("No Se Pudo Eliminar La File" + ex.Message);
        //        }
        //    }
        //    else
        //    {
        //        throw new KeyNotFoundException("La File Con El Id" + id + "No Se Pudo Encontrar");
        //    }
        //}
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


    }



}
