using Microsoft.AspNetCore.Mvc;
using Bienesoft.Services;
using Bienesoft.ProductionDTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using bienesoft.Models;

// namespace Bienesoft.Controllers
// {
//     [Route("api/permissions")]
//     [ApiController]
//     public class PermissionController : ControllerBase
//     {
//         private readonly PermissionService _service;

//         public PermissionController(PermissionService service)
//         {
//             _service = service;
//         }

//         /// <summary>
//         /// Obtiene todos los permisos con sus aprobaciones.
//         /// </summary>
//         [HttpGet]
//         public async Task<ActionResult<List<ApprovalDto>>> GetApprovals()
//         {
//             var approvals = await _service.GetPermissions();
//             return Ok(approvals);
//         }

//         /// <summary>
//         /// Crea un nuevo permiso
//         /// </summary>
//         [HttpPost]
//         public async Task<IActionResult> CreatePermission([FromBody] PermissionGN permission)
//         {
//             var result = await _service.CreatePermission(permission);
//             return result ? Ok("Permiso creado exitosamente") : BadRequest("Error al crear el permiso");
//         }

//         /// <summary>
//         /// Aprueba o rechaza un permiso
//         /// </summary>
//         [HttpPost("{permissionId}/approve/{responsibleId}")]
//         public async Task<IActionResult> ApprovePermission(int permissionId, int responsibleId, [FromBody] bool isApproved)
//         {
//             var result = await _service.ApprovePermission(permissionId, responsibleId, isApproved);
//             return result ? Ok("Permiso actualizado") : BadRequest("Error al actualizar el permiso");
//         }
//     }
// }
// using Bienesoft.ProductionDTOs;
// using Microsoft.AspNetCore.Mvc;
// using System.Threading.Tasks;

[Route("api/approvals")]
[ApiController]
public class ApprovalController : ControllerBase
{
    private readonly ApprovalService _approvalService;

    public ApprovalController(ApprovalService approvalService)
    {
        _approvalService = approvalService;
    }


    [HttpGet("GetApprovalById")]
    public async Task<IActionResult> GetApprovalById([FromQuery] int id)
    {
        var approval = await _approvalService.GetApprovalByIdAsync(id);

        if (approval == null)
        {
            return NotFound(new { message = "Approval not found" });
        }

        return Ok(approval);
    }
}

