using bienesoft.Funcions;
using bienesoft.Models;
using Bienesoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

            public ResponsibleController (IConfiguration configuration, ResponsibleServices responsibleServices)
            {
                _Configuration = configuration;
                _ResponsibleServices = responsibleServices;
            }
            [HttpPost("CreateResponsible")]
            public IActionResult AddResponsible(Responsible responsible)
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

            [HttpGet("GetResponsible")]
            public IActionResult GetResponsible(int id)
            {
                try
                {
                    var responsible = _ResponsibleServices.GetById(id);
                    if (responsible == null)
                    {
                        return NotFound("No Se Encontró El Responsable");
                    }
                    return Ok(responsible);
                }
                catch (Exception ex)
                {

                    GeneralFunction.Addlog(ex.Message);
                    return StatusCode(500, ex.ToString());

                }
            }

            [HttpPost("UpdateResponsible")]
            public IActionResult Update(int Id, Responsible responsible)
            {
                try
                {
                    return Ok();
                }
                catch (Exception ex)
                {
                    GeneralFunction.Addlog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpDelete("DeleteResponsible")]
            public IActionResult Delete(int id)
            {
                try
                {
                    var responsible = _ResponsibleServices.GetById(id);
                    if (responsible == null)
                    {
                        return NotFound("El Responsable Con El Id" + id + "No Se Pudo Encontrar");
                    }
                    _ResponsibleServices.Delete(id);
                    return Ok("Responsable Eliminado Con Exito");
                }
                catch (KeyNotFoundException knFEx)
                {
                    return NotFound(knFEx.Message);
                }
                catch (Exception ex)
                {
                    GeneralFunction.Addlog(ex.Message);
                    return StatusCode(500, ex.ToString());
                }
            }

            [HttpGet("AllResponsible")]
            public ActionResult<IEnumerable<Responsible>> GetResponsible()
            {
                return Ok(_ResponsibleServices.GetResponsible());
            }
            [HttpPut("UpdateResponsible")]
            public IActionResult Update(Responsible responsible)
            {
                if (responsible == null)
                {
                    return BadRequest("El modelo de responsable es nulo");
                }

                try
                {
                    _ResponsibleServices.UpdateResponsible(responsible);
                    return Ok("Responsable actualizado exitosamente");
                }
                catch (ArgumentNullException ex)
                {
                    return BadRequest(ex.Message);
                }
                catch (ArgumentException ex)
                {
                    return BadRequest(ex.Message);
                }
                catch (Exception ex)
                {
                    GeneralFunction.Addlog(ex.Message);
                    return StatusCode(500, ex.ToString());

                }
            }



        }
}

