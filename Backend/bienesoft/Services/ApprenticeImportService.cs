using ClosedXML.Excel;
using bienesoft.models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using bienesoft.Models;
using bienesoft.Services;
using Bienesoft.utils;
namespace Bienesoft.Services
{
    public class ApprenticeImportService
    {
        private readonly AppDbContext _context;
        private readonly UserServices _userService;

        public ApprenticeImportService(AppDbContext context, UserServices userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<object> ImportApprenticesAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);
            var rows = worksheet.RangeUsed().RowsUsed().Skip(1); // saltamos la cabecera

            var added = new List<Apprentice>();
            foreach (var row in rows)
            {
                var id = int.Parse(row.Cell(1).GetString());

                // Evitar duplicados
                if (_context.apprentice.Any(a => a.Id_Apprentice == id)) continue;

                var municipios = await _context.municipality.ToListAsync();

                var municipioDict = municipios.ToDictionary(m => m.municipality.ToLower().Trim(), m => m.Id_municipality);

                // Luego para cada fila:
                string nombre = row.Cell("Municipio").GetString().Trim().ToLower();
                if (!municipioDict.TryGetValue(nombre, out int municipioId))
                    throw new Exception($"Municipio '{nombre}' no encontrado.");


                var apprentice = new Apprentice
                {
                    Id_Apprentice = id,
                    First_Name_Apprentice = row.Cell(2).GetString(),
                    Last_Name_Apprentice = row.Cell(3).GetString(),
                    birth_date_apprentice = DateTime.Parse(row.Cell(4).GetString()),
                    Gender_Apprentice = row.Cell(5).GetString(),
                    Email_Apprentice = row.Cell(6).GetString(),
                    Address_Apprentice = row.Cell(7).GetString(),
                    Address_Type_Apprentice = row.Cell(8).GetString(),
                    Phone_Apprentice = row.Cell(9).GetString(),
                    Stratum_Apprentice = row.Cell(10).GetString(),
                    Tip_Apprentice = row.Cell(11).GetString(),
                    nom_responsible = row.Cell(12).GetString(),
                    ape_responsible = row.Cell(13).GetString(),
                    tel_responsible = row.Cell(14).GetString(),
                    email_responsible = row.Cell(15).GetString(),
                    File_Id = int.Parse(row.Cell(16).GetString()),
                    id_municipality = municipioId,
                };

                var salt = PasswordHasher.GenerateSalt();
                var hashedPassword = PasswordHasher.HashPassword("bienesoft123", salt);

                var user = new User
                {
                    Email = apprentice.Email_Apprentice,
                    HashedPassword = hashedPassword,
                    Salt = salt,
                    UserType = "Aprendiz",
                    SessionCount = 0,
                    Blockade = false,
                    Asset = true,
                    Id_Apprentice = apprentice.Id_Apprentice
                };

                _context.apprentice.Add(apprentice);
                _context.user.Add(user);
                added.Add(apprentice);
            }

            await _context.SaveChangesAsync();
            return new
            {
                message = $"Se importaron {added.Count} aprendices exitosamente."
            };
        }
    }
}