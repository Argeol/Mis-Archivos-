using bienesoft.Funcions;
using bienesoft.models;
using bienesoft.Models;
using bienesoft.Services;
using Bienesoft.Services;
using Microsoft.AspNetCore.Mvc;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApprenticeController : ControllerBase
    {
        private readonly ApprenticeService _apprenticeService;
        // private readonly IConfiguration _configuration;

        public GeneralFunction GeneralFunction;

        public ApprenticeController(ApprenticeService apprenticeService)
        {
            _apprenticeService = apprenticeService;
            // _configuration = configuration;

            // Asignar la instancia del GeneralFunction al servicio
            // GeneralFunction = new GeneralFunction(_configuration);
        }
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

        [HttpGet("{id}")]
        public IActionResult GetApprenticeById(int id)
        {
            var apprentice = _apprenticeService.GetApprenticeById(id);
            if (apprentice == null)
                return NotFound(new { message = "Aprendiz no encontrado" });

            return Ok(apprentice);
        }

        [HttpGet("all")]
        public IActionResult GetApprentices()
        {
            var list = _apprenticeService.GetApprentices();
            return Ok(list);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateApprentice(int id, [FromBody] UpdateApprentice model)
        {
            try
            {
                _apprenticeService.UpdateApprentice(id, model);
                return Ok(new { message = "Aprendiz actualizado exitosamente" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
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

    }
}
