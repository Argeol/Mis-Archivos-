using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Bienesoft.Models;
using bienesoft.Funcions;
using bienesoft.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using bienesoft.Models;
using Microsoft.AspNetCore.Authorization;

namespace Bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class AuthorizationResponsibleController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly AuthorizationResponsibleServices _AuthorizationResponsibleServices;

        public AuthorizationResponsibleController(IConfiguration configuration, AuthorizationResponsibleServices authorizationResponsibleServices)
        {
            _Configuration = configuration;
            _AuthorizationResponsibleServices = authorizationResponsibleServices;
            GeneralFunction = new GeneralFunction(_Configuration); // Asegúrate de inicializar GeneralFunction si es necesario.
        }

        [HttpPost("AddAuthorizationResponsible")]
        public IActionResult AddAuthorizationResponsible(AuthorizationResponsible authorizationResponsible)
        {
            try
            {
                _AuthorizationResponsibleServices.AddAuthorizationResponsible(authorizationResponsible);
                return Ok(new
                {
                    message = "AuthorizationResponsible agregada con éxito"
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message }); // Código 409 para conflicto
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }


        [HttpGet("GetAuthorizationResponsible")]
        public IActionResult GetResponPermission(int id)
        {
            try
            {
                var authorizationResponsible = _AuthorizationResponsibleServices.GetById(id);
                if (authorizationResponsible == null)
                {
                    return NotFound("No se encontró el AuthorizationResponsible");
                }
                return Ok(authorizationResponsible);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPut("UpdateAuthorizationResponsible")]
        public IActionResult Update(AuthorizationResponsible authorizationResponsible)
        {
            if (authorizationResponsible == null)
            {
                return BadRequest("El modelo de AuthorizationResponsible es nulo");
            }

            try
            {
                _AuthorizationResponsibleServices.UpdateAuthorizationResponsible(authorizationResponsible);
                return Ok("AuthorizationResponsible actualizado exitosamente");
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

        [HttpDelete("DeleteAuthorizationResponsible")]
        public IActionResult Delete(int id)
        {
            try
            {
                var authorizationResponsible = _AuthorizationResponsibleServices.GetById(id);
                if (authorizationResponsible == null)
                {
                    return NotFound("El AuthorizationResponsible con el ID " + id + " no se pudo encontrar");
                }
                _AuthorizationResponsibleServices.Delete(id);
                return Ok("AuthorizationResponsible eliminado con éxito");
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

        [HttpGet("AllAuthorizationResponsible")]
        public ActionResult<IEnumerable<AuthorizationResponsible>> GetAllAuthorizationResponsible()
        {
            return Ok(_AuthorizationResponsibleServices.GetAuthorizationResponsible());
        }
    }
}
