
using bienesoft.Models;
using bienesoft.Services;
using Bienesoft.utils;
using Microsoft.EntityFrameworkCore;
using bienesoft.models;
using bienesoft.Funcions;



namespace Bienesoft.Services
{

    public class ApprenticeService
    {

        private readonly AppDbContext _context;
        private readonly UserServices _userService;
        public GeneralFunction _GeneralFunction;

        public ApprenticeService(AppDbContext context, UserServices userServices, GeneralFunction generalFunction)
        {
            _context = context;
            _userService = userServices;
            _GeneralFunction = generalFunction;
        }


        public async Task<object> CreateApprenticeAsync(Apprentice apprentice, string email)
{
            // Validar existencia de correo ANTES de abrir la transacción
            if (await _userService.UserByEmail(email))
                throw new ArgumentException("El correo ya está registrado.");

            // Comenzamos una transacción
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Agregar aprendiz y guardar
                _context.apprentice.Add(apprentice);
                await _context.SaveChangesAsync(); // Guardar aprendiz

                // El ID del aprendiz ya debería estar disponible ahora
                var apprenticeId = apprentice.Id_Apprentice;

                // Crear credenciales para el nuevo usuario
                string plainPassword = PasswordGenerator.Generate(8);
                string salt = PasswordHasher.GenerateSalt();
                string hashedPassword = PasswordHasher.HashPassword(plainPassword, salt);

                var user = new User
                {
                    Email = email,
                    HashedPassword = hashedPassword,
                    Salt = salt,
                    UserType = "Aprendiz",
                    SessionCount = 0,
                    Blockade = false,
                    Asset = true,
                    Id_Apprentice = apprenticeId,  // Asociar al aprendiz creado
                };

                // Agregar usuario al contexto y guardar
                _context.user.Add(user);
                await _context.SaveChangesAsync(); // Guardar usuario

                // Confirmar transacción porque todo salió bien
                await transaction.CommitAsync();

                // Enviar correo fuera de la transacción
                string mensajeCorreo = "Correo enviado correctamente.";
                try
                {
                    await _GeneralFunction.SendWelcomeEmail(email, plainPassword);
                }
                catch (Exception ex)
                {
                    mensajeCorreo = "No se pudo enviar el correo, revisa tu conexión a internet. Detalles: " + ex.Message;
                }

                return new
                {
                    aprendiz = apprentice,
                    mensajeCorreo
                };
            }
            catch (Exception ex)
            {
                // Si algo falla, hacemos rollback
                await transaction.RollbackAsync();
                throw new Exception("No se pudo completar el registro. Detalles: " + ex.Message);
            }
}


        public object GetApprenticeById(int id)
        {
           var apprentice =  _context.apprentice
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
                    a.Municipality.Id_municipality,
                    MunicipalityName = a.Municipality.municipality,
                    DepartmentName = a.Municipality.Department.Name_department,
                    a.File.File_Id,
                    ProgramName = a.File.program.Program_Name,
                    AreaName = a.File.program.Area.Area_Name,
                    a.Status_Apprentice
                })
                .FirstOrDefault();

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
                exiteapprentice.Tip_Apprentice = update.Tip_Apprentice;

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
        public int CountApprentices()
        {
            return _context.apprentice.Count(a => a.Status_Apprentice == "Activo");
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
