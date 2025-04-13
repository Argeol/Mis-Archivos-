using Microsoft.AspNetCore.Mvc;
using Bienesoft.Services;
using Bienesoft.ProductionDTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using bienesoft.Models;


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
        [HttpPost("CrearPermiso")]
        public async Task<IActionResult> CreateApprentice(PermissionGN PermissionGN)
        {
            var Results = await _permissionService.CreatePermissionAsync(PermissionGN);
            return Ok(new { message = Results });
        }
        [HttpGet("GetPermiso")]
        public IActionResult GetActionResult()
        {
            var Results = _permissionService.GetAllPermissions();
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
        [HttpPut("UpdatePermiso")]
        public async Task<IActionResult> UpdatePermission([FromQuery] int id, [FromBody] UpdatePermiso permiso)
        {
            var result = await _permissionService.UpdatePermissionAsync(id, permiso);
            return Ok(result);
        }









    }
}