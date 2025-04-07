using bienesoft.Models;
using Microsoft.EntityFrameworkCore;

namespace bienesoft.Services
{
    public class ResponsibleServices
    {
        private readonly AppDbContext _context;
        public ResponsibleServices(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetResponsiblesAsync()
        {
            var responsible = await _context.responsible
                .Include(r => r.Role)
                .Select(r => new
                {
                    r.Responsible_Id,
                    r.Nom_Responsible,
                    r.Ape_Responsible,
                    r.Tel_Responsible,
                    Name_role = r.Role != null ? r.Role.Name_role : "No asignado",
                    r.State

                }).ToListAsync();

            return responsible.Cast<object>().ToList();
        }

        public void AddResponsible(ResponsibleModel responsible)
        {
            _context.responsible.Add(responsible);
            _context.SaveChanges();
        }

        public object GetResponsibleById(int id)
        {
            var responsible = _context.responsible
                .Include(r => r.Role)
                .Where(r => r.Responsible_Id == id)
                .Select(a => new
                {
                    a.Responsible_Id,
                    a.Nom_Responsible,
                    a.Ape_Responsible,
                    a.Tel_Responsible,
                    a.Role.Name_role,
                    a.State
                })
                .FirstOrDefault();
            return responsible; 
        }

        public async Task<ResponsibleModel?> UpdateResponsibleAsync(int Id, ResponsibleModel updateResponsible)
        {
            var existingResponsible = await _context.responsible.FindAsync(Id);
            if (existingResponsible == null)
            {
                return null;
            }

            if (updateResponsible.Nom_Responsible != "")
                existingResponsible.Nom_Responsible = updateResponsible.Nom_Responsible;

            if (updateResponsible.Ape_Responsible != "")
                existingResponsible.Ape_Responsible = updateResponsible.Ape_Responsible;

            if (updateResponsible.Tel_Responsible != 0)
                existingResponsible.Tel_Responsible = updateResponsible.Tel_Responsible;

            if (updateResponsible.RoleId != 0)
                existingResponsible.RoleId = updateResponsible.RoleId;

            await _context.SaveChangesAsync();

            return existingResponsible;
        }

    }
}
