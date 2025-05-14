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
        private readonly PermissionApprovalService _permissionApproval;

        public permissionController(PermissionService permissionService, PermissionApprovalService permissionApproval)
        {
            _permissionService = permissionService;
            _permissionApproval = permissionApproval;
        }
        // {
        //     _permissionService = permissionService;
        // }
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
        // [Authorize(Roles = "Aprendiz")]
        // [HttpPost("CrearPermiso")]
        // public async Task<IActionResult> CreateApprentice(PermissionGN PermissionGN)
        // {
        //     var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
        //     var Id = Convert.ToInt32(idApprenticeClaim); 
        //     var Results = await _permissionService.CreatePermissionAsync(PermissionGN, Id);
        //     return Ok(new { message = Results });
        // }
        [Authorize(Roles = "Aprendiz")]
        [HttpPost("CrearPermiso")]
        public async Task<IActionResult> CreateApprentice([FromBody] CreatePermissionRequest request)
        {
            try
            {
                var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
                var idApprentice = Convert.ToInt32(idApprenticeClaim);

                var result = await _permissionService.CreatePermissionAsync(request.Permission, idApprentice, request.ResponsablesSeleccionados);

                return Ok(new { success = true, message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
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
        [Authorize(Roles = "Aprendiz,Responsable")]
        [HttpGet("ConsulPermiId")]
        public async Task<IActionResult> GetPermisosDeAprendiz()
        {
            var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
            var idresponsableClaim = User.Claims.FirstOrDefault(c => c.Type == "Responsible_Id")?.Value;

            // Console.WriteLine($"Id_Apprentice: {idApprenticeClaim}");
            // Console.WriteLine($"Responsible_Id: {idresponsableClaim}");

            if (!string.IsNullOrEmpty(idApprenticeClaim))
            {
                var Id = Convert.ToInt32(idApprenticeClaim);
                var permisos = await _permissionService.GetPermisosDeAprendizAsync(Id);
                return Ok(permisos);
            }
            else if (!string.IsNullOrEmpty(idresponsableClaim))
            {
                var Id = Convert.ToInt32(idresponsableClaim);
                var permisos = await _permissionApproval.ObtenerPermisosPendientesPorResponsableAsync(Id);
                return Ok(permisos);
            }
            else
            {
                return BadRequest(new { message = "No se encontró el Id_Apprentice ni Responsible_Id en el token" });
            }
        }

    }
}