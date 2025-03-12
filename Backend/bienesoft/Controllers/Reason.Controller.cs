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
    //[Authorize]
    public class ReasonController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly ReasonServices _ReasonServices;

        public ReasonController(IConfiguration configuration, ReasonServices reasonServices)
        {
            _Configuration = configuration;
            _ReasonServices = reasonServices;
        }
        [HttpPost("CreateReason")]
        public IActionResult AddReason(Reason reason)
        {
            try
            {
                _ReasonServices.AddReason(reason);
                return Ok(new
                {
                    message = "Motivo creado con exito"
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }

        }

        [HttpGet("GetReason")]
        public IActionResult GetArea(int id)
        {
            try
            {
                var reason = _ReasonServices.GetById(id);
                if (reason == null)
                {
                    return NotFound("No Se Encontró El Motivo");
                }
                return Ok(reason);
            }
            catch (Exception ex)
            {

                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());

            }
        }

        [HttpPost("UpdateReason")]
        public IActionResult Update(int Id, Reason reason)
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

        [HttpDelete("DeleteReason")]
        public IActionResult Delete(int id)
        {
            try
            {
                var area = _ReasonServices.GetById(id);
                if (area == null)
                {
                    return NotFound("El Motivo Con El Id" + id + "No Se Pudo Encontrar");
                }
                _ReasonServices.Delete(id);
                return Ok("Reason Eliminado Con Exito");
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

        [HttpGet("AllReason")]
        public ActionResult<IEnumerable<Reason>> GetReason()
        {
            return Ok(_ReasonServices.GetReason());
        }
        [HttpPut("UpdateReason")]
        public IActionResult Update(Reason reason)
        {
            if (reason == null)
            {
                return BadRequest("El modelo de Motivo es nulo");
            }

            try
            {
                _ReasonServices.UpdateReason(reason);
                return Ok("Motivo actualizado exitosamente");
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
