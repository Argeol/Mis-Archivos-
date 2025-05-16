using bienesoft.Funcions;
using bienesoft.Models;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using bienesoft.Services;
using Bienesoft.utils;
using bienesoft.models;

namespace bienesoft.Services
{
    public class ResponsibleServices
    {
        private readonly AppDbContext _context;
        private readonly UserServices _userService;
        public GeneralFunction _GeneralFunction;

        public ResponsibleServices(AppDbContext context, UserServices userServices, GeneralFunction generalFunction)
        {
            _context = context;
            _userService = userServices;
            _GeneralFunction = generalFunction;
        }

        public async Task<object> CreateResponsibleAsync(ResponsibleModel responsible, string email)
        {
            // Validar existencia de correo Antes de abrir la transaccion
            if (await _userService.UserByEmail(email))
                throw new ArgumentException("El correo ya esta resgistrado.");

            //Comenzar una transaccion
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                //Agregar responsables y guardar
                _context.responsible.Add(responsible);
                await _context.SaveChangesAsync(); //Guardar responsable 

                //El ID  del responsable ya deberia estar disponible ahora
                var responsableId = responsible.Responsible_Id;

                //Crear credenciales para el nuevo usuario
                string plainPassword = PasswordGenerator.Generate(8);
                string salt = PasswordHasher.GenerateSalt();
                string hashedPassword = PasswordHasher.HashPassword(plainPassword, salt);

                var user = new User
                {
                    Email = email,
                    HashedPassword = hashedPassword,
                    Salt = salt,
                    UserType = "Responsable",
                    SessionCount = 0,
                    Blockade = false,
                    Asset = true,
                    Responsible_Id = responsableId, //Asociar al aprendiz creado 
                };

                //Agregar usuario al contexto y guardar
                _context.user.Add(user);
                await _context.SaveChangesAsync(); //Guarda el usuario

                //Confirma transaccion porque todo salio bien
                await transaction.CommitAsync();

                //Envia correo fuera de la transaccion
                string mensajeCorreo = "Correo enciado correctamente. ";
                try
                {
                    await _GeneralFunction.SendWelcomeEmail(email, plainPassword);
                }
                catch (Exception ex)
                {
                    mensajeCorreo = "No se pudo enviar el correo, revisa tu conexion a internet. Detalles:" + ex.Message;
                }

                return new
                {
                    responsable = responsible,
                    mensajeCorreo
                };
            }
            catch (Exception ex)
            {
                //Si algo fall, hacemos rollback
                await transaction.RollbackAsync();
                throw new Exception("No se pudo completar el registro. Detalles:" + ex.Message);
            }

        }





        public async Task<List<object>> GetResponsiblesAsync()
        {
            var responsible = await _context.responsible
                .Include(r => r.Role)
                .Select(r => new
                {
                    r.Responsible_Id,
                    r.Nom_Responsible,
                    r.Ape_Responsible,
                    r.Tel_Responsible,
                    r.Email_Responsible,
                    Name_role = r.Role != null ? r.Role.Name_role : "No asignado",
                    r.State

                }).ToListAsync();

            return responsible.Cast<object>().ToList();
        }

        public object GetResponsibleById(int id)
        {
            var responsible = _context.responsible
                .Include(r => r.Role)
                .Where(r => r.Responsible_Id == id)
                .Select(a => new
                {
                    a.Responsible_Id,
                    a.Nom_Responsible,
                    a.Ape_Responsible,
                    a.Tel_Responsible,
                    a.Role.Name_role,
                    a.State,
                    a.Email_Responsible
                })
                .FirstOrDefault();
            return responsible;
        }
        public void UpdateResponsible(int id, UpdateResponsible update)
        {
            var responsible = _context.responsible.FirstOrDefault(r => r.Responsible_Id == id);

            if (responsible == null)
            {
                throw new KeyNotFoundException("Responsable no encontrado.");
            }

            // Solo actualiza si el campo fue enviado (no nulo)
            if (update.Nom_Responsible != null)
                responsible.Nom_Responsible = update.Nom_Responsible;

            if (update.Ape_Responsible != null)
                responsible.Ape_Responsible = update.Ape_Responsible;

            if (update.Tel_Responsible != null)
                responsible.Tel_Responsible = update.Tel_Responsible;

            if (update.Email_Responsible != null)
                responsible.Email_Responsible = update.Email_Responsible;

            if (!string.IsNullOrEmpty(update.State))
                responsible.State = update.State;

            _context.SaveChanges();
        }
        public async Task<List<ResponsibleModel>> GetResponsiblesByRoleIdAsync(int roleId)
        {
            return await _context.responsible
                                 .Where(r => r.RoleId == roleId)
                                 .ToListAsync();
        }


    }
}
