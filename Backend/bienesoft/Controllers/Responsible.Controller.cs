using bienesoft.Funcions;
using bienesoft.Models;
using Bienesoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using bienesoft.Services;


namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    //[Authorize(Roles = "Administrador")]
    public class ResponsibleController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly ResponsibleServices _ResponsibleServices;

        public ResponsibleController(IConfiguration configuration, ResponsibleServices responsibleServices)
        {
            _Configuration = configuration;
            _ResponsibleServices = responsibleServices;
            GeneralFunction = new GeneralFunction(_Configuration);
        }
        [HttpPost("CreateResponsible")]
        public async Task<IActionResult> CreateResponsible([FromBody] ResponsibleModel responsible)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(responsible.Email_Responsible))
                    return BadRequest("El campo Email es obligatorio.");

                dynamic result = await _ResponsibleServices.CreateResponsibleAsync(responsible, responsible.Email_Responsible);

                return Ok(new
                {
                    message = "Responsable resgistrado correctamente.",
                    detalle = result.mensajeCorreo, 
                    result.responsable
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new {error = ex.Message});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {error = "Ocurrio un error inesperado.", detalle = ex.Message});
            }

        }

        [HttpGet("GetResponsibles")]

        public async Task<IActionResult> GetResponsible()
        {
            var responsibles = await _ResponsibleServices.GetResponsiblesAsync();
            return Ok(responsibles);
        }

        [Authorize(Roles = "Responsable")]
        [HttpGet("GetResponsibleID")]
        public IActionResult GetResponsibleById()
        {
            try
            {
                //Sacamos el Responsable_Id del token
                var idResponsibleClaim = User.Claims.FirstOrDefault(r => r.Type == "Responsible_Id")?.Value;

                var idResponsible = int.Parse(idResponsibleClaim);  

                var responsible = _ResponsibleServices.GetResponsibleById(idResponsible);
                if (responsible == null)
                    return NotFound(new { message = "Responsable no encontrado" });

                return Ok(responsible);
            }
            catch (Exception ex) 
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }


        //[HttpPut("UpdateResponsible/{Id}")]
        //public IActionResult UpdateResponsible(int Id, [FromBody] UpdateResponsible update)
        //{
        //    if (Id <= 0)
        //    {
        //        return BadRequest(new { message = "Id del responsable no es válido" });
        //    }

        //    if (update == null)
        //    {
        //        return BadRequest(new { message = "El modelo de actualización es nulo" });
        //    }

        //    try
        //    {
        //        var existingResponsible = _ResponsibleServices.GetResponsibleById(Id);
        //        if (existingResponsible == null)
        //        {
        //            return NotFound(new { message = "El responsable no existe" });
        //        }

        //        _ResponsibleServices.UpdateResponsible(Id, update); // sigue siendo async pero no se espera
        //        return Ok(new { message = "Responsable actualizado" });
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        return NotFound(new { error = ex.Message });
        //    }
        //    catch (Exception ex)
        //    {
        //        GeneralFunction.Addlog(ex.Message); // Aquí se asume que la clase es estática
        //        return StatusCode(500, new { error = ex.Message });
        //    }
        //}

        [Authorize(Roles = "Responsable")]
        [HttpPut("UpdateResponsible")]
        public IActionResult UpdateResponsible([FromBody] UpdateResponsible update)
        {
            if (update == null)
            {
                return BadRequest(new { message = "El modelo de actualización es nulo" });
            }

            try
            {
                // Obtener Responsible_Id desde el JWT
                var responsibleIdClaim = User.Claims.FirstOrDefault(c => c.Type == "Responsible_Id");
                if (responsibleIdClaim == null)
                {
                    return Unauthorized(new { message = "No se encontró el ID del responsable en el token" });
                }

                // Convertir a int (si es numérico) o string según tu modelo
                if (!int.TryParse(responsibleIdClaim.Value, out int responsibleId))
                {
                    return BadRequest(new { message = "El ID del responsable en el token no es válido" });
                }

                var existingResponsible = _ResponsibleServices.GetResponsibleById(responsibleId);
                if (existingResponsible == null)
                {
                    return NotFound(new { message = "El responsable no existe" });
                }

                _ResponsibleServices.UpdateResponsible(responsibleId, update); // o await si es async
                return Ok(new { message = "Responsable actualizado" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }

        }
            [HttpGet("GetResponsiblesByRole/roleid=1")]
            public async Task<IActionResult> GetResponsiblesByRole1()
            {
                var result = await _ResponsibleServices.GetResponsiblesByRoleIdAsync(1);
                return Ok(result);
            }

            [HttpGet("GetResponsiblesByRole/roleid=2")]
            public async Task<IActionResult> GetResponsiblesByRole2()
            {
                var result = await _ResponsibleServices.GetResponsiblesByRoleIdAsync(2);
                return Ok(result);
            }

            [HttpGet("GetResponsiblesByRole/roleid=3")]
            public async Task<IActionResult> GetResponsiblesByRole3()
            {
                var result = await _ResponsibleServices.GetResponsiblesByRoleIdAsync(3);
                return Ok(result);
            }

            [HttpGet("GetResponsiblesByRole/roleid=4")]
            public async Task<IActionResult> GetResponsiblesByRole4()
            {
                var result = await _ResponsibleServices.GetResponsiblesByRoleIdAsync(4);
                return Ok(result);
            }

    }
}


