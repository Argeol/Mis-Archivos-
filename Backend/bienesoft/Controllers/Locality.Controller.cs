// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;
// using Bienesoft.Models;
// using bienesoft.Funcions;
// using bienesoft.Services;
// using Microsoft.Extensions.Configuration;
// using System;
// using System.Collections.Generic;
// using Bienesoft.Services;
// using bienesoft.Models;
// using Microsoft.AspNetCore.Authorization;
// using bienesoft.ProductionDTOs;

// namespace bienesoft.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     //[Authorize]
//     public class LocalityController : Controller
//     {
//         public IConfiguration _Configuration { get; set; }
//         public GeneralFunction GeneralFunction;
//         private readonly LocalityServices _LocalityServices;

//         public LocalityController(IConfiguration configuration, LocalityServices localityServices)
//         {
//             _Configuration = configuration;
//             _LocalityServices = localityServices;
//             GeneralFunction = new GeneralFunction(_Configuration); // Asegúrate de inicializar GeneralFunction si es necesario.
//         }

//         [HttpPost("CreateLocality")]
//         public IActionResult AddLocality(Locality locality)
//         {
//             try
//             {
//                 _LocalityServices.AddLocality(locality);
//                 return Ok(new
//                 {
//                     message = "Localidad creada con éxito"
//                 });
//             }
//             catch (Exception ex)
//             {
//                 GeneralFunction.Addlog(ex.ToString());
//                 return StatusCode(500, ex.ToString());
//             }
//         }

//         [HttpGet("GetLocality")]
//         public ActionResult GetLocalidad(int id)
//         {
//             try
//             {
//                 var locality = _LocalityServices.GetLocalities().Select(p=> new LocalityDTO
//                 {
//                     Locality_Id = p.Locality_Id,
//                     Locality_Name = p.Locality_Name,
//                     Locality_Type = p.Locality_Type,
//                     Department_Name = p.department.Department_Name
//                 }).ToList();
                
//                 return Ok(locality);
//             }
//             catch (Exception ex)
//             {
//                 GeneralFunction.Addlog(ex.Message);
//                 return StatusCode(500, ex.ToString());
//             }
//         }

//         [HttpPut("UpdateLocality")]
//         public IActionResult UpdateLocality(int id, Locality locality)
//         {
//             if (locality == null || id != locality.Locality_Id)
//             {
//                 return BadRequest("El modelo de Localidad es nulo o el ID no coincide");
//             }

//             try
//             {
//                 _LocalityServices.UpdateLocality(locality);
//                 return Ok("Localidad actualizada exitosamente");
//             }
//             catch (ArgumentNullException ex)
//             {
//                 return BadRequest(ex.Message);
//             }
//             catch (ArgumentException ex)
//             {
//                 return BadRequest(ex.Message);
//             }
//             catch (Exception ex)
//             {
//                 GeneralFunction.Addlog(ex.Message);
//                 return StatusCode(500, ex.ToString());
//             }
//         }

//         [HttpDelete("DeleteLocality")]
//         public IActionResult Delete(int id)
//         {
//             try
//             {
//                 var locality = _LocalityServices.GetById(id);
//                 if (locality == null)
//                 {
//                     return NotFound("La localidad con el ID " + id + " no se pudo encontrar");
//                 }
//                 _LocalityServices.Delete(id);
//                 return Ok("Localidad eliminada con éxito");
//             }
//             catch (KeyNotFoundException knFEx)
//             {
//                 return NotFound(knFEx.Message);
//             }
//             catch (Exception ex)
//             {
//                 GeneralFunction.Addlog(ex.Message);
//                 return StatusCode(500, ex.ToString());
//             }
//         }

//         [HttpGet("AllLocality")]
//         public ActionResult<IEnumerable<Locality>> GetAllLocalidades()
//         {
//             return Ok(_LocalityServices.GetLocalities());
//         }
//     }
// }