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
        [HttpPost("CreateArea")]
        public IActionResult AddArea([FromBody] Area area) // Asegura que se reciba desde el cuerpo del request
        {
            if (area == null)
            {
                return BadRequest("El objeto Area no puede ser nulo.");
            }

            try
            {
                _AreaServices.AddArea(area);
                return Ok(new { message = "Área creada con éxito" });
            }
            catch (Exception ex)
            {
                GeneralFunction?.Addlog(ex.ToString()); // Evita llamar a un objeto nulo
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetArea")]
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

        [HttpPost("UpdateArea")]
        public IActionResult Update(int Id, Area area)
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

        [HttpDelete("DeleteArea")]
        public IActionResult Delete(int id)
        {
            try
            {
                var area = _AreaServices.GetById(id);
                if (area == null)
                {
                    return NotFound("El Area Con El Id" + id + "No Se Pudo Encontrar");
                }
                _AreaServices.Delete(id);
                return Ok("Area Eliminado Con Exito");
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

        [HttpGet("AllArea")]
        public ActionResult<IEnumerable<Area>> GetArea()
        {
            return Ok(_AreaServices.GetArea());
        }
        [HttpPut("UpdateArea")]
        public IActionResult Update(Area area)
        {
            if (area == null)
            {
                return BadRequest("El modelo de Area es nulo");
            }

            try
            {
                _AreaServices.UpdateArea(area);
                return Ok("Area actualizado exitosamente");
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
