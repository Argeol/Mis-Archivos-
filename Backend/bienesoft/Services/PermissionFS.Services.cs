using bienesoft.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace bienesoft.Services
{
    public class PermissionFSServices
    {
        private readonly AppDbContext _context;

        public PermissionFSServices(AppDbContext context)
        {
            _context = context;
        }

        // Get all PermissionFS records
        public IEnumerable<PermissionFS> AllPermissionFS()
        {
            return _context.permissionFS.ToList();
        }

        // Add a new PermissionFS record
        public void AddPermissionFS(PermissionFS permissionFS)
        {
            _context.permissionFS.Add(permissionFS);
            _context.SaveChanges();
        }

        // Get a PermissionFS by Id
        public PermissionFS GetById(int id)
        {
            return _context.permissionFS.FirstOrDefault(p => p.PermissionFS_Id == id);
        }

        // Delete a PermissionFS by Id
        public void Delete(int id)
        {
            var permissionFS = _context.permissionFS.FirstOrDefault(p => p.PermissionFS_Id == id);
            if (permissionFS != null)
            {
                try
                {
                    _context.permissionFS.Remove(permissionFS);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw new Exception("No Se Pudo Eliminar El permiso fin de semana: " + ex.Message);
                }
            }
            else
            {
                throw new KeyNotFoundException("El PermissionFS con el Id " + id + " no se pudo encontrar.");
            }
        }

        // Update an existing PermissionFS
        public void UpdatePermissionFS(PermissionFS permissionFS)
        {
            if (permissionFS == null)
            {
                throw new ArgumentNullException(nameof(permissionFS), "El modelo de PermissionFS es nulo");
            }

            var existingPermissionFS = _context.permissionFS.Find(permissionFS.PermissionFS_Id);
            if (existingPermissionFS == null)
            {
                throw new ArgumentException("PermissionFS no encontrado");
            }

            // Update fields
            existingPermissionFS.PermissionFS_Id = permissionFS.PermissionFS_Id; // Example field
            // Add other fields to be updated here if necessary

            _context.SaveChanges();
        }

        //// Get PermissionFS records by specific criteria
        //public IEnumerable<PermissionFS> GetPermissionFSByCriteria(int criteria)
        //{
        //    return _context.permissionFS
        //        .Where(p => p.Apprentice_Id.Contains(criteria)) // You can modify this based on your criteria
        //        .ToList();
        //}
    }
}
