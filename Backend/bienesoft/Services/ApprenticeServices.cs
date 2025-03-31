
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
                    a.First_Name_Apprentice,
                    a.Last_Name_Apprentice,
                    a.Address_Type_Apprentice,
                    a.Email_Apprentice,
                    Birth_Date_Apprentice_Formatted = a.birth_date_apprentice.ToString("yyyy-MM-dd"),
                    a.Phone_Apprentice,
                    a.Gender_Apprentice,
                    a.Tip_Apprentice,
                    MunicipalityName = a.Municipality.municipality,
                    DepartmentName = a.Municipality.Department.Name_department,
                    a.File.File_Id,
                    ProgramName = a.File.program.Program_Name,
                    AreaName = a.File.program.Area.Area_Name
                })
                .FirstOrDefault();
        }


        public async Task<Apprentice> CreateApprenticeAsync(Apprentice apprentice)
        {
            var municipality = await _context.municipality.FindAsync(apprentice.Id_Municipality);
            var file = await _context.file.FindAsync(apprentice.File_Id);

            if (file == null)
                throw new ArgumentException("La ficha no existe.");

            if (municipality == null)
                throw new ArgumentException("El municipio no existe en la base de datos.");

            _context.apprentice.Add(apprentice);
            await _context.SaveChangesAsync();

            return apprentice;
        }

        public async Task<Apprentice?> UpdateApprenticeAsync(int id, Apprentice apprenticeUpdate)
        {
            var apprentice = await _context.apprentice.FindAsync(id);
            if (apprentice == null)
                return null;

            // Si el usuario envía un campo con valor, lo actualiza; si lo omite, mantiene el valor actual.
            apprentice.First_Name_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.First_Name_Apprentice)
                ? apprenticeUpdate.First_Name_Apprentice
                : apprentice.First_Name_Apprentice;

            apprentice.Last_Name_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.Last_Name_Apprentice)
                ? apprenticeUpdate.Last_Name_Apprentice
                : apprentice.Last_Name_Apprentice;

            apprentice.birth_date_apprentice = apprenticeUpdate.birth_date_apprentice != default(DateTime)
                ? apprenticeUpdate.birth_date_apprentice
                : apprentice.birth_date_apprentice;

            apprentice.Gender_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.Gender_Apprentice)
                ? apprenticeUpdate.Gender_Apprentice
                : apprentice.Gender_Apprentice;

            apprentice.Email_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.Email_Apprentice)
                ? apprenticeUpdate.Email_Apprentice
                : apprentice.Email_Apprentice;

            apprentice.Address_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.Address_Apprentice)
                ? apprenticeUpdate.Address_Apprentice
                : apprentice.Address_Apprentice;

            apprentice.Address_Type_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.Address_Type_Apprentice)
                ? apprenticeUpdate.Address_Type_Apprentice
                : apprentice.Address_Type_Apprentice;

            apprentice.Phone_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.Phone_Apprentice)
                ? apprenticeUpdate.Phone_Apprentice
                : apprentice.Phone_Apprentice;

            apprentice.Status_Apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.Status_Apprentice)
                ? apprenticeUpdate.Status_Apprentice
                : apprentice.Status_Apprentice;

            apprentice.Id_Municipality = apprenticeUpdate.Id_Municipality > 0
                ? apprenticeUpdate.Id_Municipality
                : apprentice.Id_Municipality;

            apprentice.File_Id = apprenticeUpdate.File_Id > 0
                ? apprenticeUpdate.File_Id
                : apprentice.File_Id;

            // Actualizar los campos que están causando errores de validación
            apprentice.doc_apprentice = !string.IsNullOrWhiteSpace(apprenticeUpdate.doc_apprentice)
                ? apprenticeUpdate.doc_apprentice
                : apprentice.doc_apprentice;

            apprentice.nom_responsible = !string.IsNullOrWhiteSpace(apprenticeUpdate.nom_responsible)
                ? apprenticeUpdate.nom_responsible
                : apprentice.nom_responsible;

            apprentice.ape_responsible = !string.IsNullOrWhiteSpace(apprenticeUpdate.ape_responsible)
                ? apprenticeUpdate.ape_responsible
                : apprentice.ape_responsible;

            apprentice.tel_responsible = !string.IsNullOrWhiteSpace(apprenticeUpdate.tel_responsible)
                ? apprenticeUpdate.tel_responsible
                : apprentice.tel_responsible;

            apprentice.email_responsible = !string.IsNullOrWhiteSpace(apprenticeUpdate.email_responsible)
                ? apprenticeUpdate.email_responsible
                : apprentice.email_responsible;

            // Guardar cambios en la base de datos
            _context.Entry(apprentice).State = EntityState.Modified;
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
                    AreaName = a.File.program.Area.Area_Name
                }).ToList();
        }

        public async Task<bool> DeleteApprenticeAsync(int id)
        {
            var apprentice = await _context.apprentice.FindAsync(id);
            if (apprentice == null)
                return false;

            _context.apprentice.Remove(apprentice);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
