using bienesoft.Funcions;
using bienesoft.Services;
using Microsoft.AspNetCore.Mvc;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpGet("GetRole")]

        public async Task<IActionResult> GetRole()
        {
            var responsibles = await _roleServices.GetRoleAsync();
            return Ok(responsibles);
        }
    }

}
