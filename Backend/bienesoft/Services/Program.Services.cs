using bienesoft.Models;
using Bienesoft.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bienesoft.ProductionDTOs;

namespace bienesoft.Services
{
    public class ProgramServices
    {
        private readonly AppDbContext _context;

        public ProgramServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<object> GetPrograms()
        {
            return _context.program
                .Include(p => p.Area)
                .Select(p => new
                {
                    p.Program_Id,
                    p.Program_Name,
                    p.Area_Id
                })
                .ToList();
        }

        public async Task<List<ProgramDTO>> Getallprograms()
        {
            return await _context.program
                .Include(p => p.Area)
                .Select(p => new ProgramDTO
                {
                    Program_Id = p.Program_Id,
                    Program_Name = p.Program_Name,
                    Area_Name = p.Area.Area_Name
                })
                .ToListAsync();
        }

        public ProgramDTO GetById(int id)
        {
            var program = _context.program
                .Where(p => p.Program_Id == id)
                .Select(p => new ProgramDTO
                {
                    Program_Id = p.Program_Id,
                    Program_Name = p.Program_Name,
                    Area_Name = p.Area.Area_Name
                })
                .FirstOrDefault();

            if (program == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {id} no se encontró.");
            }

            return program;
        }

        public void Delete(int id)
        {
            var program = _context.program.FirstOrDefault(p => p.Program_Id == id);
            if (program == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {id} no se encontró.");
            }

            _context.program.Remove(program);
            _context.SaveChanges();
        }

        // Nuevo método para obtener el modelo real (ProgramModel)
        public ProgramModel GetProgramById(int id)
        {
            return _context.program.FirstOrDefault(p => p.Program_Id == id);
        }

        public void AddProgram(ProgramModel program)
        {
            _context.program.Add(program);
            _context.SaveChanges();
        }

        public void UpdateProgram(int id, UpdateModelProgram updateModel)
        {
            var existingProgram = _context.program.Find(id);
            if (existingProgram == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {id} no se encontró.");
            }

            // Solo actualiza los valores si el usuario los envía en la solicitud
            if (!string.IsNullOrWhiteSpace(updateModel.Program_Name))
            {
                existingProgram.Program_Name = updateModel.Program_Name;
            }

            if (updateModel.Area_Id.HasValue && updateModel.Area_Id.Value != 0)
            {
                existingProgram.Area_Id = updateModel.Area_Id.Value;
            }

            _context.SaveChanges();
        }

    }
}
