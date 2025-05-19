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
        // private readonly IConfiguration _configuration;

        public GeneralFunction GeneralFunction;

        public ApprenticeController(ApprenticeService apprenticeService)
        {
            _apprenticeService = apprenticeService;
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

        [Authorize(Roles = "Aprendiz")]
        [HttpGet("GetApprenticeById")]
        public IActionResult GetApprenticeById()
        {
            try
            {
                // Sacamos el Id_Apprentice del token
                var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
                if(!int.TryParse(idApprenticeClaim, out int idApprentice))
                    return Unauthorized(new { message = "No se encontró el Id_Apprentice en el token." });
                var apprentice = _apprenticeService.GetApprenticeById(idApprentice);
                if (apprentice == null)
                    return NotFound(new { message = "Aprendiz no encontrado" });

                return Ok(apprentice);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());            }
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("all")]
        public IActionResult GetApprentices()
        {
            var list = _apprenticeService.GetApprentices();
            return Ok(list);
        }

        [Authorize(Roles = "Aprendiz,Administrador")]  
        [HttpPut("update-profile")] // Opcional: cambia el endpoint si quieres
        public IActionResult UpdateApprentice([FromBody] UpdateApprentice model)
        {
            try
            {
                // Sacamos el Id_Apprentice del token
                var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;

                if (string.IsNullOrEmpty(idApprenticeClaim))
                {
                    return Unauthorized(new { message = "No se encontró el Id_Apprentice en el token." });
                }
                //se trasforma el idApprenticeClaim a numero entero
                int id = int.Parse(idApprenticeClaim);

                // Ahora sí, actualizas
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
        // [Authorize(Roles = "Aprendiz")]
        // [HttpGet("apprendiz-only")]
        // public IActionResult GetApprenticeData()
        // {
        //     var userRole = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;
        //     return Ok($"Role encontrado: {userRole}. Solo el aprendiz puede ver esto.");
        // }

    }
}
