using bienesoft.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace bienesoft.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    [Authorize(Roles = "Administrador")]
    public class MunicipalityController : ControllerBase
    {
        private readonly MunicipalityService _municipalityService;

        public MunicipalityController(MunicipalityService municipalityService)
        {
            _municipalityService = municipalityService;
        }

        [HttpGet("getMunicipalities")]
        public async Task<IActionResult> GetMunicipalities()
        {
            var municipios = await _municipalityService.GetMunicipalitiesWithDepartments();
            return Ok(municipios);
        }
        [HttpGet("byDepartment/{departmentId}")]
        public async Task<IActionResult> GetMunicipalitiesByDepartment(int departmentId)
        {
            var municipalities = await _municipalityService.GetMunicipalitiesByDepartmentAsync(departmentId);
            if (municipalities == null || municipalities.Count == 0)
            {
                return NotFound(new { message = "No se encontraron municipios para este departamento." });
            }
            return Ok(municipalities);
        }
    }

}
