using bienesoft.Models;
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
        public async Task<ActionResult<object>> GetApprenticeById(int id)
        {
            try
            {
                var apprentice = _apprenticeService.GetApprenticeById(id);
                if (apprentice == null)
                {
                    return NotFound(new { message = "Aprendiz no encontrado" });
                }
                return Ok(new { message = "Consulta exitosa", apprentice });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.ToString() });
            }
        }
        [HttpPost("CreateApprentice")]
        public async Task<IActionResult> CreateApprentice([FromBody] Apprentice apprentice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (apprentice == null)
            {
                return BadRequest(new { message = "Los datos del aprendiz son inválidos." });
            }
            try
            {
                var createdApprentice = await _apprenticeService.CreateApprenticeAsync(apprentice);
                return CreatedAtAction(nameof(GetApprenticeById), new { id = createdApprentice.Id_Apprentice }, new { message = "Aprendiz creado con éxito", createdApprentice });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException is MySqlConnector.MySqlException sqlEx && sqlEx.Message.Contains("Duplicate entry"))
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

        [HttpPut("UpdateApprentice/{id}")]
        public async Task<IActionResult> UpdateApprentice(int id, [FromBody] Apprentice apprentice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var updatedApprentice = await _apprenticeService.UpdateApprenticeAsync(id, apprentice);
                if (updatedApprentice == null)
                {
                    return NotFound(new { message = "El aprendiz no fue encontrado." });
                }
                return Ok(new { message = "Aprendiz actualizado exitosamente", updatedApprentice });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { message = "Error interno del servidor.", details = ex.Message });
            }
        }

        [HttpGet("GetApprentices")]
        public async Task<ActionResult<IEnumerable<object>>> GetApprentices()
        {
            try
            {
                var apprentices = _apprenticeService.GetApprentices();
                return Ok(apprentices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los aprendices", error = ex.Message });
            }
        }

        [HttpDelete("DeleteApprentice/{id}")]
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
