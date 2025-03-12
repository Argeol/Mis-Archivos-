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
using Bienesoft.Services;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize] // Descomenta esto si necesitas autenticación.
    public class AttendantController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly AttendantServices _AttendantServices;

        public AttendantController(IConfiguration configuration, AttendantServices attendantServices)
        {
            _Configuration = configuration;
            _AttendantServices = attendantServices;
            GeneralFunction = new GeneralFunction(_Configuration); // Asegúrate de inicializar GeneralFunction si es necesario.
        }

        // Crear un nuevo asistente
        [HttpPost("CreateAttendant")]
        public IActionResult AddAttendant(Attendant attendant)
        {
            try
            {
                _AttendantServices.AddAttendant(attendant);
                return Ok(new
                {
                    message = "Asistente creado con éxito"
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Obtener un asistente por ID
        [HttpGet("GetAttendant")]
        public IActionResult GetAttendant(int id)
        {
            try
            {
                var attendant = _AttendantServices.GetById(id);
                if (attendant == null)
                {
                    return NotFound("No se encontró el asistente");
                }
                return Ok(attendant);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        // Actualizar un asistente existente
        [HttpPut("UpdateAttendant")]
        public IActionResult UpdateAttendant(int id, UpdateModelAttendant updateModel)
        {
            if (updateModel == null)
            {
                return BadRequest("El modelo de actualización es nulo.");
            }

            try
            {
                // Obtener el asistente existente desde la base de datos
                var existingAttendant = _AttendantServices.GetById(id);

                if (existingAttendant == null)
                {
                    return NotFound($"No se encontró un asistente con el ID {id}.");
                }

                // Actualizar los campos necesarios
                existingAttendant.Attendant_Name = updateModel.Attendant_Name;
                existingAttendant.Attendant_Surname = updateModel.Attendant_Surname;
                existingAttendant.Attendant_Phone = updateModel.Attendant_Phone;
                existingAttendant.Attendant_Address = updateModel.Attendant_Address;
                existingAttendant.Attendant_Email = updateModel.Attendant_Email;

                // Guardar los cambios
                _AttendantServices.UpdateAttendant(existingAttendant);

                return Ok("Asistente actualizado exitosamente.");
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

        // Eliminar un asistente
        [HttpDelete("DeleteAttendant")]
        public IActionResult Delete(int id)
        {
            try
            {
                var attendant = _AttendantServices.GetById(id);
                if (attendant == null)
                {
                    return NotFound("El asistente con el ID " + id + " no se pudo encontrar");
                }
                _AttendantServices.Delete(id);
                return Ok("Asistente eliminado con éxito");
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

        // Obtener todos los asistentes
        [HttpGet("AllAttendants")]
        public ActionResult<IEnumerable<Attendant>> GetAllAttendants()
        {
            return Ok(_AttendantServices.GetAttendants());
        }
    }
}
