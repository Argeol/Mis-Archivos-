using bienesoft.Models;
using Bienesoft.Models;
using Microsoft.EntityFrameworkCore; // Necesario para Include()
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bienesoft.Services
{
    public class AttendantServices
    {
        private readonly AppDbContext _context;

        public AttendantServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todos los asistentes con su municipio
        public IEnumerable<object> GetAttendants()
        {
            return _context.attendant
                .Include(a => a.Municipality)
                    .ThenInclude(m => m.Department)
                .Select(a => new
                {
                    Attendant_Name = a.Attendant_Name,
                    Municipality_Name = a.Municipality.municipality,
                    Department_Name = a.Municipality.Department.Name_department

                })
                // Incluye la relación con Municipio
                .ToList();
        }

        // Obtener un asistente por ID con su municipio
        public Attendant GetById(int id)
        {
            var attendant = _context.attendant
                .Include(a => a.Municipality) // Incluye el municipio
                .FirstOrDefault(a => a.Attendant_Id == id);

            if (attendant == null)
            {
                throw new KeyNotFoundException($"El asistente con el ID {id} no se encontró en la base de datos.");
            }
            return attendant;
        }

        // Eliminar un asistente por ID
        public void Delete(int id)
        {
            var attendant = _context.attendant.FirstOrDefault(a => a.Attendant_Id == id);
            if (attendant == null)
            {
                throw new KeyNotFoundException($"El asistente con el ID {id} no se encontró.");
            }

            try
            {
                _context.attendant.Remove(attendant);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo eliminar el asistente: " + ex.Message);
            }
        }

        // Actualizar un asistente existente
        public void UpdateAttendant(Attendant attendant)
        {
            if (attendant == null)
            {
                throw new ArgumentNullException(nameof(attendant), "El modelo de Asistente es nulo.");
            }

            var existingAttendant = _context.attendant.Find(attendant.Attendant_Id);
            if (existingAttendant == null)
            {
                throw new KeyNotFoundException($"El asistente con el ID {attendant.Attendant_Id} no se encontró.");
            }

            // Actualiza los campos necesarios
            existingAttendant.Attendant_Name = attendant.Attendant_Name;
            existingAttendant.Attendant_Surname = attendant.Attendant_Surname;
            existingAttendant.Attendant_Phone = attendant.Attendant_Phone;
            existingAttendant.Attendant_Address = attendant.Attendant_Address;
            existingAttendant.Attendant_Email = attendant.Attendant_Email;
            existingAttendant.Id_Municipality = attendant.Id_Municipality; // Asegurar relación con Municipio

            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo actualizar el asistente: " + ex.Message);
            }
        }

        // Agregar un nuevo asistente
        public void AddAttendant(Attendant attendant)
        {
            if (attendant == null)
            {
                throw new ArgumentNullException(nameof(attendant), "El modelo de Asistente no puede ser nulo.");
            }

            try
            {
                // Verificar si el municipio existe antes de asignarlo
                var municipalityExists = _context.municipality.Any(m => m.Id_municipality == attendant.Id_Municipality);
                if (!municipalityExists)
                {
                    throw new ArgumentException($"El Municipio con el ID {attendant.Id_Municipality} no existe.");
                }

                _context.attendant.Add(attendant);
                _context.SaveChanges();
            }
            catch (ArgumentException argEx)
            {
                throw new Exception("Error de validación: " + argEx.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo agregar el asistente: " + ex.Message);
            }
        }
    }
}
