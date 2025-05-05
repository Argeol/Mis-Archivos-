using bienesoft.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace bienesoft.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    [Authorize(Roles = "Administrador")]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentService _departmentService;

        public DepartmentController(DepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _departmentService.GetDepartmentsAsync();
            return Ok(departments);
        }
    }
}
