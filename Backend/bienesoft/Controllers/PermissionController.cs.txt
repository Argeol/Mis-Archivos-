using bienesoft.Funcions;
using bienesoft.Models;
using bienesoft.Services;
using Bienesoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    //[Authorize]
    public class PermissionController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly PermissionServices _PermissionServices;

        public PermissionController(IConfiguration configuration, PermissionServices PermissionServices)
        {
            _Configuration = configuration;
            _PermissionServices = PermissionServices;
        }


        [HttpPost("CreatePermission")]
        public IActionResult AddPermission(Permission permission)
        {
            try
            {
                _PermissionServices.AddPermission(permission);
                return Ok(new
                {
                    message = "Permiso solicitado con exito"
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetPermission")]
        public IActionResult GetPermission(int id)
        {
            try
            {
                var permission = _PermissionServices.GetById(id);
                if (permission == null)
                {
                    return NotFound("No Se Encontró El Permission");
                }
                return Ok(permission);
            }
            catch (Exception ex)
            {

                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());

            }
        }
        [HttpPost("UpdatePermission")]
        public IActionResult Update(int Id, Permission permission )
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
        [HttpDelete("DeletePermission")]
        public IActionResult Delete(int id)
        {
            try
            {
                var permission = _PermissionServices.GetById(id);
                if (permission == null)
                {
                    return NotFound("El Permission Con El Id" + id + "No Se Pudo Encontrar");
                }
                _PermissionServices.Delete(id);
                return Ok("Permission Eliminado Con Exito");
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
        [HttpGet("AllPermission")]
        public ActionResult<IEnumerable<Permission>> GetPermission()
        {
            return Ok(_PermissionServices.GetPermission());
        }
        [HttpPut("UpdatePermission")]
        public IActionResult Update(Permission permission)
        {
            if (permission == null)
            {
                return BadRequest("El modelo de Permission es nulo");
            }

            try
            {
                _PermissionServices.UpdatePermission(permission);
                return Ok("Permission actualizado exitosamente");
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