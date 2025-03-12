using bienesoft.Funcions;
using bienesoft.Models;
using bienesoft.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class PermissionFSController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly PermissionFSServices _permissionFSServices;

        public PermissionFSController(IConfiguration configuration, PermissionFSServices permissionFSServices)
        {
            _Configuration = configuration;
            _permissionFSServices = permissionFSServices;
        }

        [HttpPost("CreatePermissionFS")]
        public IActionResult AddPermissionFS(PermissionFS permissionFS)
        {
            try
            {
                _permissionFSServices.AddPermissionFS(permissionFS);
                return Ok(new
                {
                    message = "Permiso creado con éxito"
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetPermissionFS")]
        public IActionResult GetPermissionFS(int id)
        {
            try
            {
                var permissionFS = _permissionFSServices.GetById(id);
                if (permissionFS == null)
                {
                    return NotFound("No Se Encontró El Permiso");
                }
                return Ok(permissionFS);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("UpdatePermissionFS")]
        public IActionResult Update(int id, PermissionFS permissionFS)
        {
            try
            {
                _permissionFSServices.UpdatePermissionFS(permissionFS);
                return Ok("Permiso actualizado con éxito");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpDelete("DeletePermissionFS")]
        public IActionResult Delete(int id)
        {
            try
            {
                var permissionFS = _permissionFSServices.GetById(id);
                if (permissionFS == null)
                {
                    return NotFound("El Permiso Con El Id " + id + " No Se Pudo Encontrar");
                }
                _permissionFSServices.Delete(id);
                return Ok("Permiso Eliminado Con Éxito");
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

        [HttpGet("AllPermissionFS")]
        public ActionResult<IEnumerable<PermissionFS>> GetAllPermissionFS()
        {
            return Ok(_permissionFSServices.AllPermissionFS());
        }

        [HttpPut("UpdatePermissionFS")]
        public IActionResult UpdatePermissionFS(PermissionFS permissionFS)
        {
            if (permissionFS == null)
            {
                return BadRequest("El modelo de permiso es nulo");
            }

            try
            {
                _permissionFSServices.UpdatePermissionFS(permissionFS);
                return Ok("Permiso actualizado exitosamente");
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
