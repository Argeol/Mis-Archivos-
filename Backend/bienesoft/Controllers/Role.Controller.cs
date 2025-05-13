using bienesoft.Funcions;
using bienesoft.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    [Authorize(Roles = "Administrador")]
    public class RoleController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly RoleServices _roleServices;

        public RoleController(IConfiguration configuration, RoleServices roleServices)
        {
            _Configuration = configuration;
            _roleServices = roleServices;
        }

        [Authorize(Roles = "Administrador,Aprenidz,Responsable")]
        [HttpGet("GetRole")]

        public async Task<IActionResult> GetRole()
        {
            var responsibles = await _roleServices.GetRoleAsync();
            return Ok(responsibles);
        }
    }

}
