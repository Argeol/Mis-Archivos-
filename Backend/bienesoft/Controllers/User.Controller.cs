using bienesoft.Funcions;
using bienesoft.models;
using bienesoft.Models;
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

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            try
            {
                // Verifica si el correo ya está en uso
                var existingUser = await _UserServices.GetByEmailAsync(newUser.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "El correo ya está registrado." });
                }

                // Generar salt y encriptar contraseña
                var salt = PasswordHasher.GenerateSalt();
                var hashedPassword = PasswordHasher.HashPassword(newUser.HashedPassword, salt);

                var user = new User
                {
                    Email = newUser.Email,
                    HashedPassword = hashedPassword,
                    Salt = salt,
                    UserType = newUser.UserType,
                    SessionCount = 0,
                    Blockade = false,
                    Asset = true,
                    TokJwt = null,
                    ResetToken = null,
                    ResetTokenExpiration = null,
                    Id_Apprentice = newUser.Id_Apprentice,
                    Responsible_Id = newUser.Responsible_Id
                };

                await _UserServices.AddUserAsync(user);

                return Ok(new { message = "Usuario registrado correctamente." });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Error interno del servidor.");
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

        // Este método de crear usuario es público
        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(User user)
        {
            try
            {
                string salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(user.HashedPassword + salt);
                user.Salt = salt;
                user.TokJwt = "";

                await _UserServices.AddUserAsync(user);
                return Ok(new { message = "Usuario creado con éxito" });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, ex.ToString());
            }
        }


        [HttpGet("AllUsers")]
        //[Authorize]
        public async Task<ActionResult<IEnumerable<User>>> AllUsers()
        {
            var users = await _UserServices.AllUsersAsync();
            return Ok(users);
        }


        [HttpGet("GetUser/{id}")]
        //[Authorize]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _UserServices.GetByIdAsync(id);
                if (user == null)
                {
                    return NotFound("No se encontró el usuario");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }


        [HttpDelete("DeleteUser/{id}")]
        //[Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var userToDelete = await _UserServices.GetByIdAsync(id);
                if (userToDelete == null)
                {
                    return NotFound($"El usuario con el ID {id} no se pudo encontrar");
                }
                await _UserServices.DeleteAsync(id);
                return Ok("Usuario eliminado con éxito");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPut("UpdateUser")]
        //[Authorize]
        public async Task<IActionResult> Update(User user)
        {
            if (user == null)
            {
                return BadRequest("El modelo de usuario es nulo");
            }

            try
            {
                await _UserServices.UpdateUserAsync(user);
                return Ok("Usuario actualizado exitosamente");
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.Message);
                return StatusCode(500, ex.ToString());
            }
        }


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


