using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Bienesoft.Models;
using bienesoft.Funcions;
using bienesoft.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using bienesoft.Models;
using Microsoft.AspNetCore.Authorization;
using bienesoft.ProductionDTOs;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrador")]
    public class ProgramController : ControllerBase
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly ProgramServices _ProgramServices;

        public ProgramController(IConfiguration configuration, ProgramServices programServices)
        {
            _Configuration = configuration;
            _ProgramServices = programServices;
            GeneralFunction = new GeneralFunction(_Configuration);
        }

        [HttpPost("CreateProgram")]
        public IActionResult AddProgram([FromBody] ProgramModel program)
        {
            try
            {
                _ProgramServices.AddProgram(program);
                return Ok(new { message = "Programa creado con éxito" });
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                GeneralFunction.Addlog(innerMessage);
                return StatusCode(500, new { error = innerMessage });
            }

        }

        [HttpGet("GetProgram")]
        public async Task<IActionResult> GetProgram()
        {
            try
            {
                var program = await _ProgramServices.Getallprograms();

                if (program == null || program.Count == 0)
                {
                    return NotFound(new { message = "No hay programas registrados" });
                }
                return Ok(program);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("ProgramGetId{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var program = _ProgramServices.GetById(id);
                if (program == null)
                {
                    return NotFound(new { message = $"El programa con el ID {id} no se encontró." });
                }
                return Ok(program);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Ocurrió un error al obtener el programa: {ex.Message}" });
            }
        }

        [HttpPut("UpdateProgram/{id}")]
        public IActionResult UpdateProgram(int id, [FromBody] UpdateModelProgram updateModel)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "El ID del programa no es válido." });
            }

            if (updateModel == null)
            {
                return BadRequest(new { message = "El modelo de actualización es nulo." });
            }

            try
            {
                // Verificar si el programa existe antes de actualizar
                var existingProgram = _ProgramServices.GetProgramById(id);
                if (existingProgram == null)
                {
                    return NotFound(new { message = "El programa no existe." });
                }

                // Proceder con la actualización
                _ProgramServices.UpdateProgram(id, updateModel);
                return Ok(new { message = "Programa actualizado exitosamente." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { error = "Error interno al actualizar el programa." });
            }
        }
        [HttpGet("export")]
        public async Task<IActionResult> ExportProgramsToExcel()
        {
            var fileContent = await _ProgramServices.ExportProgramsAsync();
            return File(fileContent,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Programas.xlsx");
        }
        [HttpPost("import")]
        public async Task<IActionResult> ImportProgramsFromExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se proporcionó ningún archivo.");

            try
            {
                var result = await _ProgramServices.ImportProgramsAsync(file);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = "Error al importar", detalle = ex.Message });
            }
        }


    }
}
