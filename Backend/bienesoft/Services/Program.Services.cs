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
                    p.Area_Id,
                    p.State
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
                    Area_Name = p.Area.Area_Name,
                    State = p.State
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
                    Area_Name = p.Area.Area_Name,
                    State = p.State
                })
                .FirstOrDefault();

            if (program == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {id} no se encontró.");
            }

            return program;
        }

        public ProgramModel GetProgramById(int id)
        {
            return _context.program.FirstOrDefault(p => p.Program_Id == id);
        }

        public void AddProgram(ProgramModel program)
        {
            var newProgram = new ProgramModel
            {
                Program_Id = program.Program_Id,
                Program_Name = program.Program_Name,
                Area_Id = program.Area_Id,
                State = program.State,
                FileModels = program.FileModels
            };

            _context.program.Add(newProgram);
            _context.SaveChanges();
        }

        public void UpdateProgram(int id, UpdateModelProgram updateModel)
        {
            var existingProgram = _context.program.Find(id);
            if (existingProgram == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {id} no se encontró.");
            }

            if (!string.IsNullOrWhiteSpace(updateModel.Program_Name))
            {
                existingProgram.Program_Name = updateModel.Program_Name;
            }

            if (updateModel.Area_Id.HasValue && updateModel.Area_Id.Value != 0)
            {
                existingProgram.Area_Id = updateModel.Area_Id.Value;
            }

            if (!string.IsNullOrWhiteSpace(updateModel.State))
            {
                existingProgram.State = updateModel.State;
            }
            
            _context.SaveChanges();
        }
    }
}
