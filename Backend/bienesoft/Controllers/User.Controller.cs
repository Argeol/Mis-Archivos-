using bienesoft.Funcions;
using bienesoft.models;
using bienesoft.Models;
using bienesoft.ProductionDTOs;
using bienesoft.Services;
using Bienesoft.utils;
using Microsoft.AspNetCore.Authorization; // Añadir esto
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace bienesoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly JWTModels _jwtSettings;
        private readonly UserServices _UserServices;
        public GeneralFunction GeneralFunction;

        public UserController(IConfiguration configuration, UserServices userServices)
        {
            _configuration = configuration;
            _jwtSettings = configuration.GetSection("JWT").Get<JWTModels>();
            _UserServices = userServices;
            GeneralFunction = new GeneralFunction(_configuration); // Inicializa GeneralFunction aquí
        }

        [HttpPost("Login")]
        public IActionResult Login(LoginUser login)
        {
            try
            {
                var user = _UserServices.GetByEmailAsync(login.Email).Result;
                var hashedInput = PasswordHasher.HashPassword(login.HashedPassword, user.Salt);
                if (hashedInput != user.HashedPassword)
                {
                    return Unauthorized(new { message = "Credenciales incorrectas." });
                }

                var key = Encoding.UTF8.GetBytes(_jwtSettings.keysecret);
                var claimsList = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.UserType),
                    new Claim("aud", "BienesoftClient"),
                    new Claim("iss", "BienesoftAPI"),
                    new Claim("exp", DateTimeOffset.UtcNow.AddMinutes(Convert.ToDouble(_jwtSettings.JWTExpireTime)).ToUnixTimeSeconds().ToString()),
                    new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
                };
                Console.WriteLine($"user.UserType = '{user.UserType}'");

                switch (user.UserType)

                {
                    case "Aprendiz":
                        if (user.Apprentice != null)
                        {
                            claimsList.Add(new Claim("Id_Apprentice", user.Id_Apprentice?.ToString() ?? ""));
                            claimsList.Add(new Claim("FullName", $"{user.Apprentice.First_Name_Apprentice} {user.Apprentice.Last_Name_Apprentice}"));
                        }
                        break;

                    case "Responsable":
                        if (user.Responsible != null)
                        {
                            claimsList.Add(new Claim("Responsible_Id", user.Responsible_Id?.ToString() ?? ""));
                            claimsList.Add(new Claim("FullName", $"{user.Responsible.Nom_Responsible} {user.Responsible.Ape_Responsible}"));
                        }
                        break;

                    case "Administrador":
                        // No agregamos nada extra
                        break;
                }

                var claims = new ClaimsIdentity(claimsList);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = claims,
                    Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_jwtSettings.JWTExpireTime)),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                user.TokJwt = tokenString;
                _UserServices.UpdateUserAsync(user).Wait();

                return Ok(new { message = tokenString });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Ocurrió un error en el servidor.");
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromQuery] string email)
        {
            try
            {
                var result = await _UserServices.CreateUserAsync(email);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear el usuario.", details = ex.Message });
            }
        }






        // GET: api/Users
        [Authorize(Roles = "Administrador")]
        [HttpGet]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _UserServices.GetUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener los usuarios.", details = ex.Message });
            }
        }

        //[Authorize] // Protección de la ruta con JWT
        //[HttpGet("ProtectedRoute")]
        //public IActionResult ProtectedRoute()
        //{
        //    var userEmail = User.FindFirstValue(ClaimTypes.NameIdentifier); // Obtener el usuario desde el token
        //    return Ok(new { message = $"Bienvenido, {userEmail}" });
        //}

        // Método para restablecer la contraseña (sin protección JWT)
        [HttpPost("ResetPassUser")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassUser model)
        {
            try
            {
                var user = await _UserServices.GetByEmailAsync(model.Email);
                if (user == null)
                {
                    return NotFound(new { message = "El correo electrónico no está registrado." });
                }

                // Generar un token único y fecha de expiración
                var token = Convert.ToBase64String(Encoding.UTF8.GetBytes(Guid.NewGuid().ToString()));
                user.ResetToken = token;
                user.ResetTokenExpiration = DateTime.UtcNow.AddHours(1); // Expira en 1 hora
                await _UserServices.UpdateUserAsync(user);

                // Enlace para restablecer la contraseña
                string resetLink = $"http://localhost:3000/reset-password?token={token}";

                // Enviar correo con el enlace
                var emailResponse = await GeneralFunction.SendEmail(model.Email, resetLink);
                if (!emailResponse.Status)
                {
                    return BadRequest(new { message = "Error al enviar el correo." });
                }

                return Ok(new { message = "Correo de restablecimiento de contraseña enviado correctamente." });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("AllUsers")]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<User>>> AllUsers()
        {
            var users = await _UserServices.AllUsersAsync();
            return Ok(users);
        }


        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            try
            {
                await _UserServices.DeleteByEmailAsync(email);
                return Ok(new { message = "Usuario eliminado correctamente." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar el usuario.", details = ex.Message });
            }
        }

        [Authorize(Roles = "Administrador")]
        [HttpGet("AllUsersInRange")]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<User>>> GetAllInRange(int inicio, int fin)
        {
            try
            {
                if (inicio < 1 || fin < inicio)
                {
                    return BadRequest("Los parámetros de rango son inválidos.");
                }

                var usersInRange = await _UserServices.AllUsersAsync();
                var paginatedUsers = usersInRange.Skip(inicio - 1).Take(fin - inicio + 1).ToList();

                if (!paginatedUsers.Any())
                {
                    return NotFound("No se encontraron usuarios en el rango especificado.");
                }

                return Ok(paginatedUsers);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }
        [HttpPost("ResetPasswordConfirm")]
        public async Task<IActionResult> ResetPasswordConfirm([FromBody] ResetPasswordModel model)
        {
            try
            {
                // Primero, buscar al usuario por el token de restablecimiento en lugar del correo electrónico
                var user = await _UserServices.GetByTokenAsync(model.Token); // Método que deberías tener en tu servicio para buscar por token.

                if (user == null || user.ResetTokenExpiration < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Token inválido o expirado." });
                }

                // Hashear la nueva contraseña
                string salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(model.NewPassword + salt);
                user.Salt = salt;

                // Borrar el token usado
                user.ResetToken = null;
                user.ResetTokenExpiration = null;
                await _UserServices.UpdateUserAsync(user);

                return Ok(new { message = "Contraseña restablecida correctamente." });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }

        // Modelo para la solicitud


    }
}


