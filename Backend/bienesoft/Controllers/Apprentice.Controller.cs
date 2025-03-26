using bienesoft.Models;
using Bienesoft.Models;
using Bienesoft.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using bienesoft.Funcions;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Bienesoft.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApprenticeController : ControllerBase
    {
        private readonly ApprenticeService _apprenticeService;
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;


        public ApprenticeController(ApprenticeService apprenticeService)
        {
            _apprenticeService = apprenticeService;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<apprenticeDTO>> GetPermissionById(int id)
        {
            try
            {
                var permission = await _apprenticeService.GetPermissionById(id);


                if (permission == null)
                {
                    return NotFound(new { message = "Aprendiz no encontrado" });
                }

                return Ok(permission);
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
        [HttpPost("CreateApprentice")]
        public async Task<IActionResult> CreateApprentice([FromBody] ApprenticeCreateDTO apprenticeDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (apprenticeDTO == null)
            {
                return BadRequest(new { message = "Los datos del aprendiz son inválidos." });
            }
            try
            {
                var apprentice = await _apprenticeService.CreateApprenticeAsync(apprenticeDTO);
                var response = new
                {
                    message = "Aprendiz creado con éxito",
                    apprentice
                };
                return CreatedAtAction(nameof(GetPermissionById), new { id = apprentice.Id_Apprentice }, response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                // Capturar errores de MySQL por duplicado
                if (ex.InnerException is MySqlConnector.MySqlException sqlEx &&
                    sqlEx.Message.Contains("Duplicate entry"))
                {
                    return Conflict(new { message = "El correo electrónico ya está registrado. Por favor, utiliza otro." });
                }
                return StatusCode(500, new { message = "Error al guardar en la base de datos.", details = ex.Message });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { message = "Error interno del servidor.", details = ex.Message });
            }
        }

        [HttpPut("UpdateApprentice")]
        public async Task<IActionResult> UpdateApprentice(int id, [FromBody] ApprenticeUpdateDTO apprenticeDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedApprentice = await _apprenticeService.UpdateApprenticeAsync(id, apprenticeDTO);

                if (updatedApprentice == null)
                {
                    return NotFound(new { message = "El aprendiz no fue encontrado." });
                }

                return Ok(new { message = "Apprentice actualizado exitosamente" });
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
        [HttpGet("GetApprentices")]
        public ActionResult<IEnumerable<Apprentice>> GetApprentices()
        {
            return Ok(_apprenticeService.Getapprentice());
        }
        [HttpDelete("DeleteApprentice")]
        public async Task<IActionResult> DeleteApprentice(int id)
        {
            try
            {
                var deleted = await _apprenticeService.DeleteApprenticeAsync(id);

                if (!deleted)
                {
                    return NotFound(new { message = "Aprendiz no encontrado" });
                }

                return Ok(new { message = "Aprendiz eliminado correctamente" });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { message = "Error interno al eliminar el aprendiz" });
            }
        }

    }
}
