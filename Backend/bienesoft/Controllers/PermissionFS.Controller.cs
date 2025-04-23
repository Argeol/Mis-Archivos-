using bienesoft.Models;
using bienesoft.Services;
using Bienesoft.Models;
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

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PermissionFS model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.CreateAsync(model);
            return CreatedAtAction(nameof(GetById), new { id = result.PermissionFS_Id }, result);
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
        public async Task<IActionResult> ExportToExcel()
        {
            var content = await _service.ExportToExcelAsync();
            return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "PermisosFS.xlsx");
        }
    }
}
