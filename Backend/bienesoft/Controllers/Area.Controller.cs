using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Bienesoft.Models;
using bienesoft.Funcions;
using bienesoft.Services;
using Microsoft.Extensions.Configuration;
using bienesoft.Models;
using Microsoft.AspNetCore.Authorization;

namespace Bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AreaController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly AreaServices _AreaServices;

        public AreaController(IConfiguration configuration, AreaServices areaServices)
        {
            _Configuration = configuration;
            _AreaServices = areaServices;
        }

        [HttpGet("GetAreaId")]
        public IActionResult GetArea(int id)
        {
            try
            {
                var area = _AreaServices.GetById(id);
                if (area == null)
                {
                    return NotFound("No Se Encontr� El Area");
                }
                return Ok(area);
            }
            catch (Exception ex)
            {

                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());

            }
        }

        

        [HttpGet("AllAreas")]
        public ActionResult<IEnumerable<Area>> GetArea()
        {
            return Ok(_AreaServices.GetArea());
        }
    }
}
