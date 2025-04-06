using bienesoft.Models;
using Microsoft.EntityFrameworkCore;

namespace bienesoft.Services
{
    public class RoleServices
    {
        private readonly AppDbContext  _context;

        public RoleServices(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Object>> GetRoleAsync()
        {
            var role = await _context.role
                .Select(s => new
                {
                    s.Id_role,
                    s.Name_role,
                }).ToListAsync();

            return role.Cast<object>().ToList();
        }

    }
}
