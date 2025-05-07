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
            using var transaction =await _context.Database.BeginTransactionAsync();
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
                    a.Email_Responsible,
                })
                .FirstOrDefault();
            return responsible; 
        }

        //public async Task<ResponsibleModel> UpdateResponsibleAsync(int Id, UpdateResponsible updateResponsible)
        //{
        //    var existingResponsible = await _context.responsible.FindAsync(Id);
        //    if (existingResponsible == null)
        //    {
        //        return null;
        //    }

        //    if (updateResponsible.Nom_Responsible != "")
        //        existingResponsible.Nom_Responsible = updateResponsible.Nom_Responsible;

        //    if (updateResponsible.Ape_Responsible != "")
        //        existingResponsible.Ape_Responsible = updateResponsible.Ape_Responsible;

        //    if (updateResponsible.Tel_Responsible != 0)
        //        existingResponsible.Tel_Responsible = updateResponsible.Tel_Responsible;

        //    if (updateResponsible.RoleId != 0)
        //        existingResponsible.RoleId = updateResponsible.RoleId.Value;

        //    if (updateResponsible.State != "")
        //        existingResponsible.State = updateResponsible.State;    

        //    await _context.SaveChangesAsync();

        //    return existingResponsible;
        //}
        public void UpdateResponsible(int id, UpdateResponsible updateResponsible)
        {
            var existingResponsible = _context.responsible.Find(id);
            if (existingResponsible == null)
            {
                throw new KeyNotFoundException($"El responsable con el ID {id} no se encontró.");
            }

            if (!string.IsNullOrWhiteSpace(updateResponsible.Nom_Responsible))
            {
                existingResponsible.Nom_Responsible = updateResponsible.Nom_Responsible;
            }

            if (!string.IsNullOrWhiteSpace(updateResponsible.Ape_Responsible))
            {
                existingResponsible.Ape_Responsible = updateResponsible.Ape_Responsible;
            }

            if (updateResponsible.Tel_Responsible.HasValue)
            {
                existingResponsible.Tel_Responsible = updateResponsible.Tel_Responsible.Value;
            }

            if (updateResponsible.RoleId.HasValue && updateResponsible.RoleId.Value != 0)
            {
                existingResponsible.RoleId = updateResponsible.RoleId.Value;
            }

            if (!string.IsNullOrWhiteSpace(updateResponsible.State))
            {
                existingResponsible.State = updateResponsible.State;
            }

            _context.SaveChanges();
        }




    }
}
