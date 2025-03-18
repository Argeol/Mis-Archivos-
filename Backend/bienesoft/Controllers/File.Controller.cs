using bienesoft.Funcions;
using bienesoft.Models;
using bienesoft.ProductionDTOs;
using bienesoft.Services;
using Bienesoft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("Api/[controller]")]
    //[Authorize]
    public class FileController : Controller
    {
        public IConfiguration _Configuration { get; set; }
        public GeneralFunction GeneralFunction;
        private readonly FileServices _FileServices;

        public FileController(IConfiguration configuration, FileServices fileServices)
        {
            _Configuration = configuration;
            _FileServices = fileServices;
        }


        [HttpPost("CreateFile")]
        public IActionResult AddFile(FileModel file)
        {
            try
            {
                _FileServices.AddFile(file);
                return Ok(new
                {
                    message = "Ficha registrada con exito"
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetFileById(int id)
        {
            var file = _FileServices.GetFileById(id);

            if (file == null)
            {
                return NotFound();
            }

            return Ok(file);
        }


        [HttpPost("UpdateFile")]
        public IActionResult Update(int Id, FileModel file)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpDelete("DeleteFile")]
        public IActionResult Delete(int id)
        {
            try
            {
                var file = _FileServices.GetFileById(id);
                if (file == null)
                {
                    return NotFound("La File Con El Id" + id + "No Se Pudo Encontrar");
                }
                _FileServices.Delete(id);
                return Ok("File Eliminado Con Exito");
            }
            catch (KeyNotFoundException knFEx)
            {
                return NotFound(knFEx.Message);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpGet("Getfiles")]
        public ActionResult<IEnumerable<FileModel>> Getfiles()
        {
            return Ok(_FileServices.Getfiles());
        }
        //[HttpPut("UpdateFile")]
        //public IActionResult Update(int id , FileModel file)

        //{
        //    if (file == null)
        //    {
        //        return BadRequest("El modelo de File es nulo");
        //    }

        //    try
        //    {
        //        _FileServices.UpdateFileAsync(file);
        //        return Ok("File actualizado exitosamente");
        //    }
        //    catch (ArgumentNullException ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //    catch (ArgumentException ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        GeneralFunction.Addlog(ex.Message);
        //        return StatusCode(500, ex.ToString());

        //    }
        //}
        [HttpPut]
    public async Task<IActionResult> UpdateFile([FromBody] FileModel updatedFile)
    {
        if (updatedFile == null || updatedFile.File_Id == 0)
        {
            return BadRequest("Datos inválidos.");
        }

        var result = await _FileServices.UpdateFileAsync(updatedFile);

        if (result == null)
        {
            return NotFound($"No se encontró el archivo con ID {updatedFile.File_Id}.");
        }

        return Ok(result);
    }

    }
}