// using bienesoft.Models;
// using bienesoft.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace bienesoft.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class PermissionFSController : ControllerBase
//     {
//         private readonly PermissionFSServices _permissionFSServices;

//         public PermissionFSController(PermissionFSServices permissionFSServices)
//         {
//             _permissionFSServices = permissionFSServices;
//         }

//         [HttpGet]
//         public IActionResult GetAllPermissionFS()
//         {
//             try
//             {
//                 var permissions = _permissionFSServices.AllPermissionFSWithApprentice();
//                 return Ok(permissions);
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { error = ex.Message });
//             }
//         }

//         [HttpGet("{id}")]
//         public IActionResult GetPermissionFSById(int id)
//         {
//             try
//             {
//                 var permission = _permissionFSServices.GetByIdWithApprentice(id);
//                 if (permission == null)
//                     return NotFound(new { message = "PermissionFS no encontrado" });

//                 return Ok(permission);
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { error = ex.Message });
//             }
//         }

//         [HttpPost]
//         public IActionResult AddPermissionFS([FromBody] PermissionFS permissionFS)
//         {
//             try
//             {
//                 if (permissionFS == null)
//                     return BadRequest(new { message = "El objeto PermissionFS es nulo" });

//                 _permissionFSServices.AddPermissionFS(permissionFS);
//                 return CreatedAtAction(nameof(GetPermissionFSById), new { id = permissionFS.PermissionFS_Id }, permissionFS);
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { error = ex.Message });
//             }
//         }

//         [HttpPut("{id}")]
//         public IActionResult UpdatePermissionFS(int id, [FromBody] PermissionFS permissionFS)
//         {
//             try
//             {
//                 if (id != permissionFS.PermissionFS_Id)
//                     return BadRequest(new { message = "El ID en la URL no coincide con el ID del cuerpo" });

//                 _permissionFSServices.UpdatePermissionFS(permissionFS);
//                 return NoContent();
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { error = ex.Message });
//             }
//         }

//         [HttpPatch("{id}")]
//         public IActionResult UpdateSingleField(int id, [FromBody] Dictionary<string, object> updateData)
//         {
//             try
//             {
//                 _permissionFSServices.UpdateSingleField(id, updateData);
//                 return Ok(new { message = "Campo actualizado exitosamente" });
//             }
//             catch (KeyNotFoundException ex)
//             {
//                 return NotFound(new { message = ex.Message });
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { error = ex.Message });
//             }
//         }

//         [HttpDelete("{id}")]
//         public IActionResult DeletePermissionFS(int id)
//         {
//             try
//             {
//                 _permissionFSServices.Delete(id);
//                 return NoContent();
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { error = ex.Message });
//             }
//         }

//         [HttpGet("Export")]
//         public IActionResult ExportPermissionFS()
//         {
//             try
//             {
//                 var excelStream = _permissionFSServices.ExportPermissionFSToExcel();
//                 return File(excelStream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "PermissionsFS.xlsx");
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { error = ex.Message });
//             }
//         }
//     }
// }
