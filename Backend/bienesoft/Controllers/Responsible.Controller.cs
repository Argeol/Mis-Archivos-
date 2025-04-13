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
            GeneralFunction = new GeneralFunction(_Configuration);
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
        public IActionResult UpdateResponsible(int Id, [FromBody] UpdateResponsible update)
        {
            if (Id <= 0)
            {
                return BadRequest(new { message = "Id del responsable no es válido" });
            }

            if (update == null)
            {
                return BadRequest(new { message = "El modelo de actualización es nulo" });
            }

            try
            {
                var existingResponsible = _ResponsibleServices.GetResponsibleById(Id);
                if (existingResponsible == null)
                {
                    return NotFound(new { message = "El responsable no existe" });
                }

                _ResponsibleServices.UpdateResponsible(Id, update); // sigue siendo async pero no se espera
                return Ok(new { message = "Responsable actualizado" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message); // Aquí se asume que la clase es estática
                return StatusCode(500, new { error = ex.Message });
            }
        }



    }
}


