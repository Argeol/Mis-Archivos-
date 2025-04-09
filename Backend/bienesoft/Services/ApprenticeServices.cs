
using bienesoft.Models;
using Microsoft.EntityFrameworkCore;


namespace Bienesoft.Services
{

    public class ApprenticeService
    {

        private readonly AppDbContext _context;

        public ApprenticeService(AppDbContext context)
        {
            _context = context;
        }


        public object GetApprenticeById(int id)
        {
            return _context.apprentice
                .Include(a => a.Municipality)
                    .ThenInclude(m => m.Department)
                .Include(a => a.File)
                    .ThenInclude(f => f.program)
                        .ThenInclude(p => p.Area)
                .Where(a => a.Id_Apprentice == id)
                .Select(a => new
                {
                    a.Id_Apprentice,
                    a.doc_apprentice,
                    a.First_Name_Apprentice,
                    a.Last_Name_Apprentice,
                    a.Address_Type_Apprentice,
                    a.Address_Apprentice,
                    a.Email_Apprentice,
                    Birth_Date_Apprentice_Formatted = a.birth_date_apprentice.ToString("yyyy-MM-dd"),
                    a.Phone_Apprentice,
                    a.Gender_Apprentice,
                    a.Tip_Apprentice,
                    a.nom_responsible,
                    a.ape_responsible,
                    a.email_responsible,
                    a.tel_responsible,
                    MunicipalityName = a.Municipality.municipality,
                    DepartmentName = a.Municipality.Department.Name_department,
                    a.File.File_Id,
                    ProgramName = a.File.program.Program_Name,
                    AreaName = a.File.program.Area.Area_Name,
                    a.Status_Apprentice
                })
                .FirstOrDefault();
        }


        public async Task<Apprentice> CreateApprenticeAsync(Apprentice apprentice)
        {
            var municipality = await _context.municipality.FindAsync(apprentice.id_municipality);
            var file = await _context.file.FindAsync(apprentice.File_Id);

            if (file == null)
                throw new ArgumentException("La ficha no existe.");

            if (municipality == null)
                throw new ArgumentException("El municipio no existe en la base de datos.");

            _context.apprentice.Add(apprentice);
            await _context.SaveChangesAsync();

            return apprentice;
        }

        public IEnumerable<object> GetApprentices()
        {
            return _context.apprentice
                .Include(a => a.Municipality)
                    .ThenInclude(m => m.Department)
                .Include(a => a.File)
                    .ThenInclude(f => f.program)
                        .ThenInclude(p => p.Area)
                .Select(a => new
                {
                    a.Id_Apprentice,
                    a.doc_apprentice,
                    a.First_Name_Apprentice,
                    a.Last_Name_Apprentice,
                    a.Address_Type_Apprentice,
                    a.Address_Apprentice,
                    a.Email_Apprentice,
                    Birth_Date_Apprentice_Formatted = a.birth_date_apprentice.ToString("yyyy-MM-dd"),
                    a.Phone_Apprentice,
                    a.Gender_Apprentice,
                    a.Tip_Apprentice,
                    a.nom_responsible,
                    a.ape_responsible,
                    a.email_responsible,
                    a.tel_responsible,
                    MunicipalityName = a.Municipality.municipality,
                    DepartmentName = a.Municipality.Department.Name_department,
                    a.File.File_Id,
                    ProgramName = a.File.program.Program_Name,
                    AreaName = a.File.program.Area.Area_Name,
                    a.Status_Apprentice
                }).ToList();
        }
        public void UpdateApprentice(int id, UpdateApprentice update)
        {

            var exiteapprentice = _context.apprentice.Find(id);


            if (exiteapprentice == null)
            {
                throw new KeyNotFoundException($"El aprendiz con ID {id} no se encontró.");
            }

            if (!string.IsNullOrWhiteSpace(update.first_name_apprentice))
                exiteapprentice.First_Name_Apprentice = update.first_name_apprentice;

            if (!string.IsNullOrWhiteSpace(update.last_name_apprentice))
                exiteapprentice.Last_Name_Apprentice = update.last_name_apprentice;

            if (update.birth_date_apprentice.HasValue)
                exiteapprentice.birth_date_apprentice = update.birth_date_apprentice.Value;

            if (!string.IsNullOrWhiteSpace(update.gender_apprentice))
                exiteapprentice.Gender_Apprentice = update.gender_apprentice;

            if (!string.IsNullOrWhiteSpace(update.email_apprentice))
                exiteapprentice.Email_Apprentice = update.email_apprentice;

            if (!string.IsNullOrWhiteSpace(update.address_apprentice))
                exiteapprentice.Address_Apprentice = update.address_apprentice;

            if (!string.IsNullOrWhiteSpace(update.address_type_apprentice))
                exiteapprentice.Address_Type_Apprentice = update.address_type_apprentice;

            if (!string.IsNullOrWhiteSpace(update.phone_Apprentice))
                exiteapprentice.Phone_Apprentice = update.phone_Apprentice;

            if (!string.IsNullOrWhiteSpace(update.status_Apprentice))
                exiteapprentice.Status_Apprentice = update.status_Apprentice;

            if (update.id_municipality.HasValue && update.id_municipality.Value != 0)
            {
                exiteapprentice.id_municipality = update.id_municipality.Value;
            }

            if (update.File_Id.HasValue)
                exiteapprentice.File_Id = update.File_Id.Value;

            if (!string.IsNullOrWhiteSpace(update.Tip_Apprentice))
                exiteapprentice.doc_apprentice = update.Tip_Apprentice;

            if (!string.IsNullOrWhiteSpace(update.doc_apprentice))
                exiteapprentice.doc_apprentice = update.doc_apprentice;

            if (!string.IsNullOrWhiteSpace(update.nom_responsible))
                exiteapprentice.nom_responsible = update.nom_responsible;

            if (!string.IsNullOrWhiteSpace(update.ape_responsible))
                exiteapprentice.ape_responsible = update.ape_responsible;

            if (!string.IsNullOrWhiteSpace(update.tel_responsible))
                exiteapprentice.tel_responsible = update.tel_responsible;

            if (!string.IsNullOrWhiteSpace(update.email_responsible))
                exiteapprentice.email_responsible = update.email_responsible;

            _context.SaveChanges();
        }


    }
    // public async Task<bool> DeleteApprenticeAsync(int id)
    // {
    //     var apprentice = await _context.apprentice.FindAsync(id);
    //     if (apprentice == null)
    //         return false;

    //     _context.apprentice.Remove(apprentice);
    //     await _context.SaveChangesAsync();
    //     return true;
    // }
}
