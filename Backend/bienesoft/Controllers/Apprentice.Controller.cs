using bienesoft.Models;
using Bienesoft.Models;
using Bienesoft.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using bienesoft.Funcions;

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
            if (CreateApprentice == null)
            {
                return NotFound(new { message = "El aprendiz no se pudo crear." });
            }

            try
            {
                var apprentice = await _apprenticeService.CreateApprenticeAsync(apprenticeDTO);
                return CreatedAtAction(nameof(GetPermissionById), new { id = apprentice.Id_Apprentice }, apprentice);
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
        [HttpPut("{id}")]
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
        [HttpDelete("{id}")]
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
