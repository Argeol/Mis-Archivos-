using System.Security.Claims;
using bienesoft.Funcions;
using bienesoft.models;
using bienesoft.Models;
using bienesoft.Services;
using Bienesoft.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bienesoft.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ApprenticeController : ControllerBase
    {
        private readonly ApprenticeService _apprenticeService;
        private readonly ApprenticeImportService _apprenticeImportService;
        // private readonly IConfiguration _configuration;

        public GeneralFunction GeneralFunction;

        public ApprenticeController(ApprenticeService apprenticeService, ApprenticeImportService apprenticeImportService)
        {
            _apprenticeService = apprenticeService;
            _apprenticeImportService = apprenticeImportService;
            // _configuration = configuration;

            // Asignar la instancia del GeneralFunction al servicio
            // GeneralFunction = new GeneralFunction(_configuration);
        }
        [Authorize(Roles = "Administrador")]
        [HttpPost]
        public async Task<IActionResult> CreateApprentice([FromBody] Apprentice apprentice)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(apprentice.Email_Apprentice))
                    return BadRequest("El campo Email_Apprentice es obligatorio.");

                dynamic result = await _apprenticeService.CreateApprenticeAsync(apprentice, apprentice.Email_Apprentice);

                return Ok(new
                {
                    message = "Aprendiz registrado correctamente.",
                    detalle = result.mensajeCorreo,
                    result.aprendiz
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Ocurrió un error inesperado.", detalle = ex.Message });
            }
        }
        [Authorize(Roles = "Administrador,Responsable")]
        [HttpGet("GetApprenticeByIdAdmi/{id}")]
        public IActionResult GetApprenticeById(int id)
        {
            try
            {
                var apprentice = _apprenticeService.GetApprenticeById(id);
                if (apprentice == null)
                    return NotFound(new { message = "Aprendiz no encontrado" });

                return Ok(apprentice);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }
        // GET: api/Apprentice/exists/5
        [HttpGet("existApprentice/{id}")]
        public IActionResult ExisteApprentice(int id)
        {
            bool existe = _apprenticeService.ExisteApprentice(id);
            return Ok(new { existe });
        }

        [Authorize(Roles = "Aprendiz")]
        [HttpGet("GetApprenticeById")]
        public IActionResult GetApprenticeById()
        {
            try
            {
                // Sacamos el Id_Apprentice del token
                var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
                if (!int.TryParse(idApprenticeClaim, out int idApprentice))
                    return Unauthorized(new { message = "No se encontró el Id_Apprentice en el token." });
                var apprentice = _apprenticeService.GetApprenticeById(idApprentice);
                if (apprentice == null)
                    return NotFound(new { message = "Aprendiz no encontrado" });

                return Ok(apprentice);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("all")]
        public IActionResult GetApprentices()
        {
            var list = _apprenticeService.GetApprentices();
            return Ok(list);
        }

        [Authorize(Roles = "Aprendiz,Administrador")]
        [HttpPut("UpdateApprentice/{id}")]
        public IActionResult UpdateApprentice(int id, [FromBody] UpdateApprentice updateApprentice)
        {
            try
            {
                _apprenticeService.UpdateApprentice(id, updateApprentice);
                return NoContent(); // 204 - Actualización exitosa sin contenido
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocurrió un error al actualizar el aprendiz.", error = ex.Message });
            }
        }

        [HttpGet("CountApprentices")]
        public IActionResult CountApprentices()
        {
            try
            {
                var count = _apprenticeService.CountApprentices();
                return Ok(new { TotalAprendices = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error al contar los aprendices.", Details = ex.Message });
            }
        }
        // [Authorize(Roles = "Administrador")]
        [HttpPost("import")]
        public async Task<IActionResult> ImportApprentices(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Debe proporcionar un archivo válido.");

            try
            {
                var result = await _apprenticeImportService.ImportApprenticesAsync(file);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al importar", detalle = ex.Message });
            }
        }
        [Authorize(Roles = "Administrador")]
        [HttpGet("ExportByFile/{fileId}")]
        public async Task<IActionResult> ExportByFile(int fileId)
        {
            try
            {
                var fileContent = await _apprenticeService.ExportApprenticesByFileIdAsync(fileId);

                var fileName = $"Aprendices_Ficha_{fileId}.xlsx";

                return File(fileContent,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            fileName);
            }
            catch (KeyNotFoundException ex)
            {
                // Excepción lanzada si no existe la ficha
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                // Cualquier otro error inesperado
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }


        // [Authorize(Roles = "Aprendiz")]
        // [HttpGet("apprendiz-only")]
        // public IActionResult GetApprenticeData()
        // {
        //     var userRole = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        //     return Ok($"Role encontrado: {userRole}. Solo el aprendiz puede ver esto.");
        // }

    }
}
