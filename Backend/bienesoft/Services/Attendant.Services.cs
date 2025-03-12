using bienesoft.Models;
using Bienesoft.Models;
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

        // Obtener todos los asistentes
        public IEnumerable<Attendant> GetAttendants()
        {
            return _context.attendant.ToList(); // Asegúrate de que 'attendants' es el DbSet correcto en tu contexto.
        }

        // Obtener un asistente por ID
        public Attendant GetById(int id)
        {
            var attendant = _context.attendant.FirstOrDefault(a => a.Attendant_Id == id);
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
                throw new KeyNotFoundException($"El asistente con el ID {id} no se pudo encontrar.");
            }

            try
            {
                _context.attendant.Remove(attendant); // Asegúrate de que 'attendants' es el DbSet correcto.
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
                // Verificar si el ID ya existe
                var existingAttendant = _context.attendant.FirstOrDefault(a => a.Attendant_Id == attendant.Attendant_Id);
                if (existingAttendant != null)
                {
                    throw new ArgumentException($"El asistente con el ID {attendant.Attendant_Id} ya existe.");
                }

                // Agregar el nuevo asistente
                _context.attendant.Add(attendant); // Usa el nombre correcto del DbSet.
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
