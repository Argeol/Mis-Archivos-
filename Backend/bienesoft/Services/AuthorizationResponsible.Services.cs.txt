using bienesoft.Models; // Asegúrate de que este espacio de nombres sea correcto
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bienesoft.Models
{
    public class AuthorizationResponsibleServices
    {
        private readonly AppDbContext _context;

        public AuthorizationResponsibleServices(AppDbContext context)
        {
            _context = context;
        }

        // Obtener todas las ResponPermissions
        public IEnumerable<AuthorizationResponsible> GetAuthorizationResponsible()
        {
            return _context.authorizationResponsible.ToList(); // Asegúrate de que 'ResponPermissions' es el DbSet correcto en tu contexto.
        }

        // Obtener una ResponPermission por ID
        public AuthorizationResponsible GetById(int id)
        {
            var authorizationResponsible = _context.authorizationResponsible.FirstOrDefault(rp => rp.AuthorizationResponsible_Id == id);
            if (authorizationResponsible == null)
            {
                throw new KeyNotFoundException($"La AuthorizationResponsible con el ID {id} no se encontró en la base de datos.");
            }
            return authorizationResponsible;
        }

        // Eliminar una ResponPermission por ID
        public void Delete(int id)
        {
            var authorizationResponsible = _context.authorizationResponsible.FirstOrDefault(rp => rp.AuthorizationResponsible_Id == id);
            if (authorizationResponsible == null)
            {
                throw new KeyNotFoundException($"La AuthorizationResponsible con el ID {id} no se pudo encontrar.");
            }

            try
            {
                _context.authorizationResponsible.Remove(authorizationResponsible); // Asegúrate de que 'ResponPermissions' es el DbSet correcto.
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo eliminar la AuthorizationResponsible: " + ex.Message);
            }
        }

        // Actualizar una ResponPermission existente
        public void UpdateAuthorizationResponsible(AuthorizationResponsible authorizationResponsible)
        {
            if (authorizationResponsible == null)
            {
                throw new ArgumentNullException(nameof(authorizationResponsible), "El modelo de AuthorizationResponsible es nulo.");
            }

            var existingAuthorizationResponsible = _context.authorizationResponsible.Find(authorizationResponsible.AuthorizationResponsible_Id);
            if (existingAuthorizationResponsible == null)
            {
                throw new KeyNotFoundException($"La AuthorizationResponsible con el ID {authorizationResponsible.AuthorizationResponsible_Id} no se encontró.");
            }

            // Actualiza los campos necesarios
            existingAuthorizationResponsible.Responsible_Id = authorizationResponsible.AuthorizationResponsible_Id;
            existingAuthorizationResponsible.Permission_Id = authorizationResponsible.Permission_Id;

            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo actualizar la AuthorizationResponsible: " + ex.Message);
            }
        }

        // Agregar una nueva ResponPermission
        public void AddAuthorizationResponsible(AuthorizationResponsible authorizationResponsible)
        {
            if (authorizationResponsible == null)
            {
                throw new ArgumentNullException(nameof(authorizationResponsible), "El modelo de ResponPermission no puede ser nulo.");
            }

            // Verificar si el ID ya existe
            var existingResponPermission = _context.authorizationResponsible.FirstOrDefault(rp => rp.AuthorizationResponsible_Id == authorizationResponsible.AuthorizationResponsible_Id);
            if (existingResponPermission != null)
            {
                throw new InvalidOperationException($"El ID {authorizationResponsible.AuthorizationResponsible_Id} ya está registrado en la base de datos. Intente con otro.");
            }

            try
            {
                _context.authorizationResponsible.Add(authorizationResponsible); // Asegúrate de que 'responPermission' es el DbSet correcto.
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("No se pudo agregar la AuthorizationResponsible: " + ex.Message);
            }
        }
    }
    }
