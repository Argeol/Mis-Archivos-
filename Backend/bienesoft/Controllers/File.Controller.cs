using System.Runtime.CompilerServices;
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

    [Authorize(Roles = "Administrador")]
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
        public async Task<IActionResult> AddFile(FileModel file)
        {
            try
            {
                await _FileServices.AddFileAsync(file);
                // Desactiva aprendices de fichas vencidas
                int desactivados = await _FileServices.DesactivarAprendicesPorFichasFinalizadasAsync();

                return Ok(new
                {
                    message = $"Ficha registrada con éxito. {desactivados} aprendices fueron desactivados por fichas finalizadas."
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
        [HttpGet("GetFileProgram/{ProgramId}")]
        public async Task<IActionResult> GetFileProgram(int ProgramId)
        {
            var files = await _FileServices.GetFileProgramAsync(ProgramId);
            if (files == null || files.Count == 0)
            {
                return NotFound(new { message = "No se encontraron fichas para este programa." });
            }
            return Ok(files);
        }



        //[HttpPost("UpdateFile")]
        //public async Task<IActionResult> UpdateFile(int Id, FileModel updatedFile)
        //{

        //    try
        //    {
        //        var updatefile = await _FileServices.UpdateFileAsync( Id,updatedFile);
        //        if (updatefile == null)
        //        {
        //            return BadRequest(new { message = "Ficha no encontrada" });
        //        }
        //        return Ok(new {message = "Aprendiz actualizado exitosamente "});
        //    }
        //    catch (Exception ex)
        //    {
        //        GeneralFunction.Addlog(ex.Message);
        //        return StatusCode(500, ex.ToString());
        //    }
        //}
        //[HttpDelete("DeleteFile")]
        //public IActionResult Delete(int id)
        //{
        //    try
        //    {
        //        var file = _FileServices.GetFileById(id);
        //        if (file == null)
        //        {
        //            return NotFound("La File Con El Id" + id + "No Se Pudo Encontrar");
        //        }
        //        _FileServices.Delete(id);
        //        return Ok("File Eliminado Con Exito");
        //    }
        //    catch (KeyNotFoundException knFEx)
        //    {
        //        return NotFound(knFEx.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        GeneralFunction.Addlog(ex.Message);
        //        return StatusCode(500, ex.ToString());
        //    }
        //}
        [HttpGet("GetFiles")]
        public async Task<IActionResult> GetFiles()
        {
            var files = await _FileServices.GetFilesAsync();
            return Ok(files);
        }

        [HttpPut("UpdateFile/{Id}")]
        public async Task<IActionResult> UpdateFile(int Id, [FromBody] FileModel updatedFile)
        {
            try
            {
                //// Validar que el ID de la URL coincida con el ID en el objeto enviado
                //if (Id != updatedFile.File_Id)
                //{
                //    return BadRequest(new { message = "El ID en la URL no coincide con el ID de la ficha" });
                //}

                var updatefile = await _FileServices.UpdateFileAsync(Id, updatedFile);
                if (updatefile == null)
                {
                    return NotFound(new { message = "Ficha no encontrada" });
                }

                return Ok(new { message = "Ficha actualizada exitosamente" });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, new { error = ex.Message });
            }
        }

    }
}