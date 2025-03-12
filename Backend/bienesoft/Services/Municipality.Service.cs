using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bienesoft.Models;

public class MunicipalityService
{
    private readonly AppDbContext _context;

    public MunicipalityService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<object>> GetMunicipalitiesWithDepartments()
    {
        var municipios = await _context.municipality
            .Include(m => m.Department)  // Carga la relación con Departamento
            .Select(m => new
            {
                m.Id_municipality,
                m.municipality,
                DepartmentName = m.Department.Name_department // Asegúrate de que este nombre existe
            })
            .ToListAsync();

        return municipios.Cast<object>().ToList(); // Se convierte a List<object> para evitar problemas con tipos anónimos
    }
     public async Task<List<Municipality>> GetMunicipalitiesByDepartmentAsync(int departmentId)
        {
            return await _context.municipality
                .Where(m => m.Id_department == departmentId)
                .ToListAsync();
        }
}
