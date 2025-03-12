using bienesoft.Models; // Asegúrate de que este espacio de nombres sea correcto
using Bienesoft.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace bienesoft.Models
{
    public class ProgramServices
    {
        private readonly AppDbContext _context;

        public ProgramServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los programas
        public IEnumerable<ProgramModel> GetPrograms()
        {
            return _context.program.Include(p => p.Area).ToList(); // Asegúrate de que 'program' es el DbSet correcto en tu contexto.
        }

        // Obtener un programa por ID
        public ProgramModel GetById(int id)
        {
            var program = _context.program.FirstOrDefault(p => p.Program_Id == id);
            if (program == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {id} no se encontró en la base de datos.");
            }
            return program;
        }

        // Eliminar un programa por ID
        public void Delete(int id)
        {
            var program = _context.program.FirstOrDefault(p => p.Program_Id == id);
            if (program == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {id} no se pudo encontrar.");
            }

            try
            {
                _context.program.Remove(program); // Asegúrate de que 'program' es el DbSet correcto.
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo eliminar el programa: " + ex.Message);
            }
        }

        // Actualizar un programa existente
        public void UpdateProgram(ProgramModel program)
        {
            if (program == null)
            {
                throw new ArgumentNullException(nameof(program), "El modelo de Program es nulo.");
            }

            var existingProgram = _context.program.Find(program.Program_Id);
            if (existingProgram == null)
            {
                throw new KeyNotFoundException($"El programa con el ID {program.Program_Id} no se encontró.");
            }

            // Actualiza los campos necesarios
            existingProgram.Program_Name = program.Program_Name;

            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo actualizar el programa: " + ex.Message);
            }
        }

        // Agregar un nuevo programa
        public void AddProgram(ProgramModel program)
        {
            if (program == null)
            {
                throw new ArgumentNullException(nameof(program), "El modelo de Program no puede ser nulo.");
            }

            try
            {
                // Verificar si el ID ya existe
                var existingProgram = _context.program.FirstOrDefault(p => p.Program_Id == program.Program_Id);
                if (existingProgram != null)
                {
                    throw new ArgumentException($"El programa con el ID {program.Program_Id} ya existe.");
                }

                // Agregar el nuevo programa
                _context.program.Add(program); // Usa el nombre correcto del DbSet.
                _context.SaveChanges();
            }
            catch (ArgumentException argEx)
            {
                throw new Exception("Error de validación: " + argEx.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo agregar el programa: " + ex.Message);
            }
        }

    }
}
    

