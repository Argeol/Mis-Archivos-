
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
using bienesoft.ProductionDTOs;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class ProgramController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly ProgramServices _ProgramServices;

        public ProgramController(IConfiguration configuration, ProgramServices programServices)
        {
            _Configuration = configuration;
            _ProgramServices = programServices;
            GeneralFunction = new GeneralFunction(_Configuration); // Asegúrate de inicializar GeneralFunction si es necesario.
        }

        [HttpPost("CreateProgram")]
        public IActionResult AddProgram(ProgramModel program)
        {
            try
            {
                _ProgramServices.AddProgram(program);
                return Ok(new
                {
                    message = "Programa creado con éxito"
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("GetProgram")]
        public async Task <IActionResult>GetProgram()
        {
             var program = await _ProgramServices.Getallprograms();

            if (program == null || program.Count == 0) 
            {
                return BadRequest(new { message = "No hay programas registrados" });
            }
            return Ok(program);
        }

        [HttpPut("UpdateProgram")]
        public IActionResult UpdateProgram(int id, UpdateModelProgram updateModel)
        {
            if (updateModel == null)
            {
                return BadRequest("El modelo de actualización es nulo.");
            }

            try
            {
                // Obtener el programa existente desde la base de datos
                var existingProgram = _ProgramServices.GetById(id);

                if (existingProgram == null)
                {
                    return NotFound($"No se encontró un programa con el ID {id}.");
                }

                // Actualizar solo el campo necesario
                existingProgram.Program_Name = updateModel.Program_Name;

                // Guardar los cambios
                _ProgramServices.UpdateProgram(existingProgram);

                return Ok("Programa actualizado exitosamente.");
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


        [HttpDelete("DeleteProgram")]
        public IActionResult Delete(int id)
        {
            try
            {
                var program = _ProgramServices.GetById(id);
                if (program == null)
                {
                    return NotFound("El programa con el ID " + id + " no se pudo encontrar");
                }
                _ProgramServices.Delete(id);
                return Ok("Programa eliminado con éxito");
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

        [HttpGet("AllPrograms")]
        public ActionResult<IEnumerable<ProgramModel>> GetAllPrograms()
        {
            return Ok(_ProgramServices.GetPrograms());
        }
    }
}