using bienesoft.Funcions;
using bienesoft.Models;
using Bienesoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using bienesoft.Services;


namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class ResponsibleController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly ResponsibleServices _ResponsibleServices;

        public ResponsibleController(IConfiguration configuration, ResponsibleServices responsibleServices)
        {
            _Configuration = configuration;
            _ResponsibleServices = responsibleServices;
        }
        [HttpPost("CreateResponsible")]
        public IActionResult AddResponsible(ResponsibleModel responsible)
        {
            try
            {
                _ResponsibleServices.AddResponsible(responsible);
                return Ok(new
                {
                    message = "Responsable creado con exito"
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }

        }

        [HttpGet("GetResponsibles")]

        public async Task<IActionResult> GetResponsible()
        {
            var responsibles = await _ResponsibleServices.GetResponsiblesAsync();
            return Ok(responsibles);
        }

        [HttpGet("{Id}")]

        public IActionResult GetResponsible(int Id) 
        {
            var responsible = _ResponsibleServices.GetResponsibleById(Id);

            if (responsible == null)
            {
                return NotFound();
            }
            return Ok(responsible);
        }

        [HttpPut("UpdateResponsible/{Id}")]

        public async Task<IActionResult> UpdateResponsible(int Id, [FromBody] ResponsibleModel updateResponsible)
        {
            try
            {
                var updateresponsible = await _ResponsibleServices.UpdateResponsibleAsync(Id, updateResponsible);
                if (updateResponsible == null)
                {
                    return NotFound(new { message = "Responsable no encontrado" });
                }
                return Ok(new { message = "Responsable Actualizado exitosamente" });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}


