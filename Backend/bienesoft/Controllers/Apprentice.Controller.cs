// using bienesoft.Models;
// using bienesoft.Services;
// using Microsoft.AspNetCore.Mvc;
// using System.Threading.Tasks;

// namespace bienesoft.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class ApprenticeController : ControllerBase
//     {
//         private readonly ApprenticeService _apprenticeService;

//         public ApprenticeController(ApprenticeService apprenticeService)
//         {
//             _apprenticeService = apprenticeService;
//         }

//         [HttpGet]
//         public async Task<IActionResult> GetApprentices()
//         {
//             var apprentices = await _apprenticeService.GetApprenticesAsync();
//             return Ok(apprentices);
//         }

//         [HttpPost]
//         public async Task<IActionResult> RegisterApprentice([FromBody] Apprentice apprentice)
//         {
//             if (apprentice == null)
//             {
//                 return BadRequest("Datos inválidos");
//             }

//             var result = await _apprenticeService.RegisterApprenticeAsync(apprentice);

//             if (!result)
//             {
//                 return BadRequest("El municipio no existe");
//             }

//             return Ok("Aprendiz registrado exitosamente");
//         }
//     }
// }


// // using bienesoft.Funcions;
// // using bienesoft.Models;
// // using bienesoft.Services;
// // using Microsoft.AspNetCore.Authorization;
// // using Microsoft.AspNetCore.Http;
// // using Microsoft.AspNetCore.Mvc;
// // using Microsoft.EntityFrameworkCore;
// // using System.Collections.Generic;
// // using System.Linq;

// // namespace bienesoft.Controllers
// // {
// //     [ApiController]
// //     [Route("Api/[controller]")]

// //     public class ApprenticeController : Controller

// //     {
//// //         public IConfiguration _Configuration { get; set; }
//// //         public GeneralFunction GeneralFunction;
//// //         private readonly ApprenticeServices _ApprenticeServices;


// //         public ApprenticeController(IConfiguration configuration, ApprenticeServices apprenticeServices)
// //         {
// //             _Configuration = configuration;
// //             _ApprenticeServices = apprenticeServices;
// //         }

// //         [HttpPost("Create")]
// //         public IActionResult AddApprendice(Apprentice apprentice)
// //         {
// //             try
// //             {
// //                 //var error = GeneralFunction.ValidModel(apprentice);
// //                 //if (error.Length == 0)
// //                 //{
// //                     _ApprenticeServices.AddApprendice(apprentice);
// //                     return Ok(new
// //                     {
// //                         message = "Apprentice Creado Con Exito"
// //                     });
// //                 //}
// //                 //return BadRequest();
// //             }
// //             catch (Exception ex)
// //             {
// //                 GeneralFunction.Addlog(ex.ToString());
// //                 return StatusCode(500, ex.ToString());
// //             }
// //         }

// //         [HttpGet("AllApprentice")]
// //         public ActionResult<IEnumerable<Apprentice>> AllApprentice()
// //         {
// //             return Ok(_ApprenticeServices.AllApprentice());
// //         }

// //         [HttpGet("GetApprentice")]
// //         public IActionResult GetApprentice(int id)
// //         {
// //             try
// //             {
// //                 var apprentice = _ApprenticeServices.GetById(id);
// //                 if (apprentice == null)
// //                 {
// //                     return NotFound("No se encontró el aprendiz");
// //                 }
// //                 return Ok(apprentice);
// //             }
// //             catch (Exception ex)
// //             {
// //                 GeneralFunction.Addlog(ex.Message);
// //                 return StatusCode(500, ex.ToString());
// //             }
// //         }

// //         [HttpDelete("DeleteApprentice")]
// //         public IActionResult Delete(int id)
// //         {
// //             try
// //             {
// //                 var apprentice = _ApprenticeServices.GetById(id);
// //                 if (apprentice == null)
// //                 {
// //                     return NotFound($"El aprendiz con el ID {id} no se pudo encontrar");
// //                 }
// //                 _ApprenticeServices.Delete(id);
// //                 return Ok("Apprentice eliminado con éxito");
// //             }
// //             catch (KeyNotFoundException knFEx)
// //             {
// //                 return NotFound(knFEx.Message);
// //             }
// //             catch (Exception ex)
// //             {
// //                 GeneralFunction.Addlog(ex.Message);
// //                 return StatusCode(500, ex.ToString());
// //             }
// //         }

// //         [HttpPut("UpdateApprentice")]
// //         public IActionResult Update(Apprentice apprentice)
// //         {
// //             if (apprentice == null)
// //             {
// //                 return BadRequest("El modelo de Apprentice es nulo");
// //             }

// //             try
// //             {
// //                 _ApprenticeServices.UpdateApprentice(apprentice);
// //                 return Ok("Apprentice actualizado exitosamente");
// //             }
// //             catch (ArgumentNullException ex)
// //             {
// //                 return BadRequest(ex.Message);
// //             }
// //             catch (ArgumentException ex)
// //             {
// //                 return BadRequest(ex.Message);
// //             }
// //             catch (Exception ex)
// //             {
// //                 GeneralFunction.Addlog(ex.Message);
// //                 return StatusCode(500, ex.ToString());
// //             }
// //         }

// //         [HttpGet("AllApprenticeInRange")]
// //         public ActionResult<IEnumerable<Apprentice>> GetAllInRange(int Inicio, int Fin)
// //         {
// //             try
// //             {
// //                 // Validar los parámetros
// //                 if (Inicio < 1 || Fin < Inicio)
// //                 {
// //                     return BadRequest("Los parámetros de rango son inválidos.");
// //                 }

// //                 var apprentice = _ApprenticeServices.AllApprentice()
// //                                                     .Skip(Inicio - 1)
// //                                                     .Take(Fin - Inicio + 1)
// //                                                     .ToList();

// //                 if (!apprentice.Any())
// //                 {
// //                     return NotFound("No se encontraron aprendices en el rango especificado.");
// //                 }

// //                 return Ok(apprentice);
// //             }
// //             catch (Exception ex)
// //             {
// //                 GeneralFunction.Addlog(ex.Message);
// //                 return StatusCode(500, ex.ToString());
// //             }
// //         }
// //     }
// // }
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
        public ActionResult<IEnumerable<Attendant>> GetApprentices()
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
