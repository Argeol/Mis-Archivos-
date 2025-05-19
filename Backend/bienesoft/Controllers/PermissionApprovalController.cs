using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Bienesoft.Services;
using Microsoft.AspNetCore.Authorization;

namespace Bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionApprovalController : ControllerBase
    {
        private readonly PermissionApprovalService _approvalService;

        public PermissionApprovalController(PermissionApprovalService approvalService)
        {
            _approvalService = approvalService;
        }

        [Authorize(Roles = "Responsable")]
        [HttpPut("aprobar")]
        public async Task<IActionResult> AprobarPermiso([FromQuery] int idPermiso)
        {
            var idResponsableClaim = User.Claims.FirstOrDefault(c => c.Type == "Responsible_Id")?.Value;

            if (string.IsNullOrEmpty(idResponsableClaim))
                return Unauthorized(new { message = "ID de responsable no encontrado en el token." });

            if (!int.TryParse(idResponsableClaim, out int idResponsable))
                return BadRequest(new { message = "ID de responsable inválido." });

            var result = await _approvalService.AprobarPermisoAsync(idPermiso, idResponsable);

            return Ok(new { message = result });
        }
        
        [Authorize(Roles = "Responsable")]
        [HttpPut("rechazar")]
        public async Task<IActionResult> RechazarPermiso([FromQuery] int idPermiso)
        {
            var claimValue = User.Claims.FirstOrDefault(c => c.Type == "Responsible_Id")?.Value;
            if (!int.TryParse(claimValue, out int idResponsable))
                return Unauthorized(new { message = "ID de responsable inválido o no presente en el token." });

            var result = await _approvalService.RechazarPermisoAsync(idPermiso, idResponsable);
            return Ok(new { message = result });
        }

        // [HttpPost("pendiente")]
        // public async Task<IActionResult> MarcarPendiente([FromQuery] int idPermiso, [FromQuery] int idResponsable)
        // {
        //     var result = await _approvalService.MarcarPendienteAsync(idPermiso, idResponsable);
        //     return Ok(new { message = result });
        // }

        [HttpGet("estado")]
        public async Task<IActionResult> GetEstadoPermiso([FromQuery] int idPermiso)
        {
            var result = await _approvalService.GetEstadoPermisoAsync(idPermiso);
            return Ok(result);
        }
        [HttpGet("pendientes-aprobar")]
        public IActionResult GetPendingApprovals([FromQuery] int permissionId)
        {
            var data = _approvalService.GetPendingApprovalsBy(permissionId);
            return Ok(data);
        }
    }
}
