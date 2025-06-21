
﻿using bienesoft.Models;
using bienesoft.Services;
using Bienesoft.Models;
using Bienesoft.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionFSController : ControllerBase
    {
        private readonly PermissionFSService _service;

        public PermissionFSController(PermissionFSService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Aprendiz, Administrador ")]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreatePermissionFS model)
        {
            var activo = _service.GetEstadoPermisoFS();
            if (!activo)
                return BadRequest("El registro de permisos FS está desactivado actualmente.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Obtener el ID del aprendiz desde el token
                var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
                if (string.IsNullOrEmpty(idApprenticeClaim))
                    return Unauthorized(new { success = false, message = "No se pudo obtener el aprendiz desde el token." });

                var idApprentice = Convert.ToInt32(idApprenticeClaim);

                //// Asignar el aprendiz al modelo antes de guardarlo
                //model.Id_Apprentice = idApprentice;

                var result = await _service.CreateAsync(model.Permission, idApprentice);

                return CreatedAtAction(nameof(GetById), new { id = result.PermissionFS_Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        //[Authorize(Roles = "Administrador")]
        [HttpPost("CreateByAdmin")]
        public async Task<IActionResult> CreateByAdmin([FromBody] CreatePermissionFSAdmin model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _service.CreateAsync(model.Permission, model.Apprentice_Id);
                return CreatedAtAction(nameof(GetById), new { id = result.PermissionFS_Id }, result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { message = "Permiso no encontrado." });

            return Ok(result);
        }




        // Aquí se cambia de PATCH a PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] PermissionFS model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(id, model);
            if (updated == null)
                return NotFound(new { message = "Permiso no encontrado o error en los datos." });

            return Ok(updated);
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportToExcel([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var content = await _service.ExportToExcelAsync(startDate, endDate);
            return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"PermisosFS_{startDate:yyyyMMdd}_{endDate:yyyyMMdd}.xlsx");
        }


        [Authorize(Roles = "Aprendiz")]
        [HttpGet("apprenticePermiId")]
        public async Task<IActionResult> GetPermisosDeAprendiz()
        {

            // Sacamos el Id_Apprentice del token
            var idApprenticeClaim = User.Claims.FirstOrDefault(c => c.Type == "Id_Apprentice")?.Value;
            var Id = Convert.ToInt32(idApprenticeClaim);

            var permisos = await _service.GetPermisosFSDeAprendizAsync(Id);
            return Ok(permisos);
        }

        //[Authorize(Roles = "Administrador")]
        [HttpGet("consulta-estado-permisoFS")]
        public IActionResult GetEstadoPermisoFS()
        {
            return Ok(new { activo = _service.GetEstadoPermisoFS() });
        }

        //[Authorize(Roles = "Administrador")]
        [HttpPost("cambia-estado-permisoFS")]
        public IActionResult SetEstadoPermisoFS([FromBody] bool estado)
        {
            _service.SetEstadoPermisoFS(estado);
            return Ok(new { mensaje = "Estado actualizado correctamente" });
        }
    }
}
