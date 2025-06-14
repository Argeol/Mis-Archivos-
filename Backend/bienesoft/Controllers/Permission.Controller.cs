using Microsoft.AspNetCore.Mvc;
using Bienesoft.Services;
using Bienesoft.ProductionDTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using bienesoft.Models;
using Microsoft.AspNetCore.Authorization;
using DocumentFormat.OpenXml.Drawing.Charts;



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
        public async Task<IActionResult> CreateApprentice(CreatePermissionRequest Request)
        {
            try
            {
                var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
                var idApprentice = Convert.ToInt32(idApprenticeClaim);

                var result = await _permissionService.CreatePermissionAsync(Request.Permission, idApprentice, Request.ResponsablesSeleccionados);

                return Ok(new { success = true, message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        [Authorize(Roles = "Administrador")]
        [HttpPost("CrearPermisoAdmi")]
        public async Task<IActionResult> CreatePermissionAdmi(CreatePermissionRequest Request, [FromQuery] int idApprentice)
        {
            try
            {

                var result = await _permissionService.CreatePermissionAsync(Request.Permission, idApprentice, Request.ResponsablesSeleccionados);

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
        [Authorize(Roles = "Aprendiz")]
        [HttpPut("UpdatePermission/{id}")]
        public async Task<IActionResult> UpdatePermission(int id, [FromBody] UpdatePermiso permiso)
        {
            var result = await _permissionService.UpdatePermissionAsync(id, permiso);
            return Ok(result);
        }

        [Authorize(Roles = "Aprendiz")]
        [HttpGet("GetPermissionsByApprentice")]
        public async Task<IActionResult> GetPermissionsByApprentice()
        {
            var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
            if (string.IsNullOrEmpty(idApprenticeClaim) || !int.TryParse(idApprenticeClaim, out int id))
                return Unauthorized(new { message = "ID de aprendiz inválido." });

            var permisos = await _permissionService.GetPermissionsByApprenticeId(id);
            return Ok(permisos);
        }
        [Authorize(Roles = "Responsable")]
        [HttpGet("GetPendingPermissionsForResponsible")]
        public async Task<IActionResult> GetPendingPermissionsForResponsible()
        {
            var idresponsableClaim = User.Claims.FirstOrDefault(c => c.Type == "Responsible_Id")?.Value;
            if (string.IsNullOrEmpty(idresponsableClaim) || !int.TryParse(idresponsableClaim, out int id))
                return Unauthorized(new { message = "ID de responsable inválido." });

            var permisos = _permissionApproval.ObtenerPermisosPendientesPorResponsableAsync(id);
            return Ok(permisos);
        }

        [Authorize(Roles = "Aprendiz")]
        [HttpDelete("EliminarPermisoPorAprendiz")]
        public async Task<IActionResult> EliminarPermiso(int idPermiso)
        {
            var idresponsableClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
            if (string.IsNullOrEmpty(idresponsableClaim) || !int.TryParse(idresponsableClaim, out int idAprendiz))
                return Unauthorized(new { message = "ID de responsable inválido." });

            var resultado = await _permissionService.EliminarPermisoPorAprendizAsync(idPermiso, idAprendiz);

            if (resultado.Contains("no encontrado") || resultado.Contains("no puede"))
            {
                return BadRequest(new { message = resultado });
            }

            return Ok(new { message = resultado });
        }
    }


}
