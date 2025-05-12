using Microsoft.AspNetCore.Mvc;
using Bienesoft.Services;
using Bienesoft.ProductionDTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using bienesoft.Models;
using Microsoft.AspNetCore.Authorization;



namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class permissionController : ControllerBase
    {
        private readonly PermissionService _permissionService;

        public permissionController(PermissionService permissionService)
        {
            _permissionService = permissionService;
        }
        // [HttpPost("create")]
        // public async Task<IActionResult> CreatePermission([FromBody] CreatePermissionRequest request)
        // {
        //     try
        //     {
        //         var response = await _permissionService.CreatePermissionAsync(request.Permission, request.ResponsablesSeleccionados);
        //         return Ok(response); // Devuelve el objeto de respuesta
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(new { Success = false, Message = ex.Message });
        //     }
        // }
        [Authorize(Roles = "Aprendiz")]
        [HttpPost("CrearPermiso")]
        public async Task<IActionResult> CreateApprentice(PermissionGN PermissionGN)
        {
            var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
            var Id = Convert.ToInt32(idApprenticeClaim); 
            var Results = await _permissionService.CreatePermissionAsync(PermissionGN, Id);
            return Ok(new { message = Results });
        }
        
        [HttpGet("GetPermiso")]
        public IActionResult GetActionResult()
        {
            var Results = _permissionService.GetAllPermissions();
            return Ok(Results);
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> ObtenerResumen()
        {
            var resumen = await _permissionService.ObtenerResumenPermisosAsync();
            return Ok(resumen);
        }



        [HttpGet("GetPermisoById/{id}")]
        public IActionResult GetPermissionById(int id)
        {
            var Results = _permissionService.GetPermissionById(id);
            if (Results == null)
            {
                return NotFound(new { message = "Permiso no encontrado" });
            }
            return Ok(Results);
        }
        [HttpGet("exportar-aprobados")]
        public IActionResult ExportApproved()
        {
            var fileBytes = _permissionService.ExportApprovedPermissionsToExcel();
            var fileName = $"PermisosAprobados_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

            return File(fileBytes,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);
        }
        [HttpPut("UpdatePermission/{id}")]
        public async Task<IActionResult> UpdatePermission(int id, [FromBody] UpdatePermiso permiso)
        {
            var result = await _permissionService.UpdatePermissionAsync(id, permiso);
            return Ok(result);
        }
        [Authorize(Roles = "Aprendiz")]
        [HttpGet("apprenticePermiId")]
        public async Task<IActionResult> GetPermisosDeAprendiz()
        {

            // Sacamos el Id_Apprentice del token
            var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
            var Id = Convert.ToInt32(idApprenticeClaim);

            var permisos = await _permissionService.GetPermisosDeAprendizAsync(Id);
            return Ok(permisos);
        }

    }
}