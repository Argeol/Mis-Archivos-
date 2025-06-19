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
        public static string NormalizarTexto(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "";

            var normalized = input.Normalize(System.Text.NormalizationForm.FormD);
            var sinTildes = new string(normalized
                .Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark)
                .ToArray());

            return sinTildes.ToUpper().Trim();
        }


        public async Task<object> ImportApprenticesAsync(IFormFile file)
        {
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheet(1);
            var rows = worksheet.RangeUsed().RowsUsed().Skip(1); // saltamos encabezado

            var added = new List<Apprentice>();
            var municipiosConNombreDuplicado = new List<string>();
            var municipiosNoEncontrados = new List<string>();
            var correosDuplicados = new List<(int IdApprentice, string Email)>(); // <-- cambio

            var municipios = await _context.municipality
                .Include(m => m.Department)
                .ToListAsync();

            var municipioLookup = municipios
                .GroupBy(m => NormalizarTexto(m.municipality))
                .ToDictionary(g => g.Key, g => g.ToList());

            // Correos que ya han sido usados dentro del Excel mismo (para evitar duplicados en memoria)
            var correosEnExcel = new HashSet<string>();

            foreach (var row in rows)
            {
                int id = int.Parse(row.Cell(1).GetValue<string>().Trim());

                if (_context.apprentice.Any(a => a.Id_Apprentice == id))
                    continue;

                string? nombreMunicipioRaw = row.Cell(15).GetValue<string?>()?.Trim();

                int municipioId = 0;
                bool esAmbiguo = false;

                if (!string.IsNullOrWhiteSpace(nombreMunicipioRaw))
                {
                    string nombreMunicipio = NormalizarTexto(nombreMunicipioRaw);

                    if (municipioLookup.TryGetValue(nombreMunicipio, out var coincidencias))
                    {
                        if (coincidencias.Count > 1)
                            esAmbiguo = true;

                        municipioId = coincidencias.First().Id_municipality;
                    }
                    else
                    {
                        municipiosNoEncontrados.Add(nombreMunicipioRaw);
                        municipioId = 0; // o dejar en null si cambias tipo en modelo
                    }

                    if (esAmbiguo)
                        municipiosConNombreDuplicado.Add(nombreMunicipioRaw);
                }

                var email = row.Cell(4).GetValue<string?>()?.Trim()?.ToLower() ?? "";

                // Rechazar si el correo:
                // - ya está en la base de datos
                // - ya fue registrado dentro del mismo Excel
                bool existeEnBD = await _context.apprentice.AnyAsync(a => a.Email_Apprentice == email)
                               || await _context.user.AnyAsync(u => u.Email == email);

                if (string.IsNullOrWhiteSpace(email) || existeEnBD || correosEnExcel.Contains(email))
                {
                    correosDuplicados.Add((id, email));
                    continue;
                }

                correosEnExcel.Add(email); // se marca como ya usado

                var apprentice = new Apprentice
                {
                    Id_Apprentice = id,
                    First_Name_Apprentice = row.Cell(2).GetValue<string?>()?.Trim() ?? "SIN NOMBRE",
                    Last_Name_Apprentice = row.Cell(3).GetValue<string?>()?.Trim() ?? "SIN APELLIDO",
                    Email_Apprentice = email,
                    Address_Apprentice = row.Cell(5).GetValue<string?>()?.Trim() ?? "SIN DIRECCIÓN",
                    Phone_Apprentice = row.Cell(6).GetValue<string?>()?.Trim() ?? "0000000000",
                    Status_Apprentice = row.Cell(7).GetValue<string?>()?.Trim().ToUpper() == "INACTIVO" ? "Inactivo" : "Activo",
                    File_Id = row.Cell(8).GetValue<int>(),
                    Tip_Apprentice = (row.Cell(9).GetValue<string?>()?.Trim().ToLower()) switch
                    {
                        "interno" => "interno",
                        "externo" => "externo",
                        _ => "externo"
                    },
                    nom_responsible = row.Cell(10).GetValue<string?>()?.Trim() ?? "SIN NOMBRE",
                    ape_responsible = row.Cell(11).GetValue<string?>()?.Trim() ?? "SIN APELLIDO",
                    tel_responsible = row.Cell(12).GetValue<string?>()?.Trim() ?? "0000000000",
                    Stratum_Apprentice = row.Cell(13).GetValue<string?>()?.Trim() ?? "0",
                    tip_document = (row.Cell(14).GetValue<string?>()?.Trim().ToUpper()) switch
                    {
                        "TI" => "TI",
                        "CC" => "CC",
                        "CE" => "CE",
                        _ => "CC"
                    },
                    id_municipality = municipioId
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

            var duplicados = municipiosConNombreDuplicado
                .GroupBy(n => n)
                .Select(g => $"{g.Key} ({g.Count()})")
                .ToList();

            var noEncontrados = municipiosNoEncontrados
                .GroupBy(n => n)
                .Select(g => $"{g.Key} ({g.Count()})")
                .ToList();

            var correosDuplicadosReporte = correosDuplicados
                .GroupBy(cd => cd.Email)
                .Select(g => $"{g.Key} (IDs: {string.Join(",", g.Select(x => x.IdApprentice))})")
                .ToList();

            return new
            {
                message = $"Se importaron {added.Count} aprendices exitosamente.",
                municipiosDuplicados = duplicados,
                municipiosNoEncontrados = noEncontrados,
                correosDuplicados = correosDuplicadosReporte
            };
        }


    }
}