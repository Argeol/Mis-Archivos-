using Bienesoft.Models;
using Microsoft.EntityFrameworkCore;
namespace bienesoft.Models
{
    public class PermissionServices
    {
        private readonly AppDbContext _context;

        public PermissionServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable <Permission> GetPermission()
        {
            return _context.permissiongn.ToList();
        }
        public void AddPermission(Permission permission)
        {
            _context.permissiongn.Add(permission);
            _context.SaveChanges();
        }
        public Permission GetById(int id)
        {
            return _context.permissiongn.FirstOrDefault(p => p.Permission_Id == id);
        }
        public void Delete(int id)
        {
            var permission = _context.permissiongn.FirstOrDefault(p => p.Permission_Id == id);
            if (permission != null)
            {
                try
                {
                    _context.permissiongn.Remove(permission);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw new Exception("No Se Pudo Eliminar El Permission" + ex.Message);
                }
            }
            else
            {
                throw new KeyNotFoundException("El Permission Con El Id" + id + "No Se Pudo Encontrar");
            }
        }
        public void UpdatePermission(Permission permission)
        {
            if (permission == null)
            {
                throw new ArgumentNullException(nameof(Permission), "El modelo de Permission es nulo");
            }

            var existingPermission = _context.permissiongn.Find(permission.Permission_Id);
            if (existingPermission == null)
            {
                throw new ArgumentException("Permission no encontrado");
            }

            existingPermission.Permission_Id = permission.Permission_Id;
            // Actualiza otros campos según sea necesario

            _context.SaveChanges();
        }
    }
}
