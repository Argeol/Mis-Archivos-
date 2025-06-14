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
using System.ComponentModel.DataAnnotations.Schema;
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
        //cerrar sesion borrar el token de los cookies 
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Borrar la cookie con el nombre que usaste para guardar el token (por ejemplo: "jwt")
            Response.Cookies.Delete("refreshToken");
            Response.Cookies.Delete("token");
            return Ok(new { message = "Sesión cerrada correctamente" });

        }
        [HttpGet("ValidateToken")]
        public IActionResult ValidateToken()
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                return Ok(new { isValid = true });
            }
            return Ok(new { isValid = false });
        }

        [HttpPost("Login")]
        public IActionResult Login(LoginUser login)
        {
            try
            {
                var user = _UserServices.GetByEmailAsync(login.Email).Result;
                if (user == null)
                {
                    return Unauthorized(new { message = "Tu correo no esta registrado en el sistema, Verificalo" });
                }
                var cleanPassword = login.HashedPassword?.Trim();
                var hashedInput = PasswordHasher.HashPassword(cleanPassword, user.Salt);
                if (hashedInput != user.HashedPassword)
                {
                    return Unauthorized(new { message = "Credenciales incorrectas" });
                }
                if (user.Apprentice != null && user.Apprentice.Status_Apprentice == "Inactivo")
                {
                    return Unauthorized(new { message = "Acceso denegado. Tu estado es inactivo." });
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
                if (user.UserType == "Administrador" || user.UserType == "Responsable")
                {
                    var refreshToken = Guid.NewGuid().ToString(); // Puedes usar un generador más seguro si deseas
                    user.RefreshToken = refreshToken;
                    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Validez de 7 días

                    _UserServices.UpdateUserAsync(user).Wait(); // Guardas el RefreshToken

                    Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                    {
                        HttpOnly = true,
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTimeOffset.UtcNow.AddDays(7)
                    });
                }
                // return Ok(new { message = tokenString });
                Response.Cookies.Append("token", tokenString, new CookieOptions
                {
                    HttpOnly = true,
                    // Secure = true, // Solo si usas HTTPS
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(Convert.ToDouble(_jwtSettings.JWTExpireTime))

                });
                object UserObject = null;

                if (user.UserType == "Responsable" && user.Responsible != null)
                {
                    UserObject = new UserLoginResponseDTO
                    {
                        Responsible_Id = user.Responsible.Responsible_Id,
                        Nom_Responsible = user.Responsible.Nom_Responsible,
                        Ape_Responsible = user.Responsible.Ape_Responsible,
                        Tel_Responsible = user.Responsible.Tel_Responsible,
                        Email_Responsible = user.Responsible.Email_Responsible,
                        State = user.Responsible.State
                    };
                }
                else if (user.UserType == "Aprendiz" && user.Apprentice != null)
                {
                    UserObject = user.Apprentice; // Aquí puedes mapear a un DTO si lo prefieres
                }
                else if (user.UserType == "Administrador")
                {
                    UserObject = new
                    {
                        user.Email,
                    };
                }
                else
                {
                    return BadRequest(new { message = "Tipo de usuario no reconocido." });
                }

                // Al final, se hace un solo return:
                return Ok(new
                {
                    message = "Inicio Sesion Exitoso",
                    tip = user.UserType,
                    user = UserObject
                });
            }
            catch (Exception ex)
            {
                GeneralFunction.Addlog(ex.ToString());
                return StatusCode(500, "Ocurrió un error en el servidor.");
            }
        }
        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new { message = "Token expirado. Inicia sesión de nuevo." });

            var user = await _UserServices.GetByRefreshTokenAsync(refreshToken);

            if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized(new { message = "Token inválido o expirado." });

            if (user.UserType == "Aprendiz")
                return Unauthorized(new { message = "Tu sesión ha expirado. Debes iniciar sesión." });

            // Generar nuevo token JWT
            var key = Encoding.UTF8.GetBytes(_jwtSettings.keysecret);
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.UserType),
        new Claim("aud", "BienesoftClient"),
        new Claim("iss", "BienesoftAPI"),
        new Claim("exp", DateTimeOffset.UtcNow.AddMinutes(Convert.ToDouble(_jwtSettings.JWTExpireTime)).ToUnixTimeSeconds().ToString()),
        new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
    };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_jwtSettings.JWTExpireTime)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Audience = "BienesoftClient",
                Issuer = "BienesoftAPI"
            };

            var token = new JwtSecurityTokenHandler().CreateToken(tokenDescriptor);
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            Response.Cookies.Append("token", tokenString, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(Convert.ToDouble(_jwtSettings.JWTExpireTime))
            });

            return Ok(new { message = "Token renovado correctamente" });
        }

        [Authorize(Roles = "Administrador")]
        [HttpPost("createAdmi")]
        public async Task<IActionResult> CreateUser([FromBody] Administrador request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _UserServices.CreateUserAsync(request.Email);
                return Ok(new { message = result });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error interno: " + ex.Message });
            }
        }


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
                string resetLink = $"http://localhost:3000/user/reset-password?token={token}";

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

        [HttpGet("GetUser{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _UserServices.GetUserByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "Usuario no encontrado." });

            return Ok(user);
        }

        [HttpGet("GetAdmins")]
        public async Task<IActionResult> GetAllAdmins()
        {
            try
            {
                var admins = await _UserServices.GetAllAdminsAsync();
                return Ok(admins);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener administradores.", details = ex.Message });
            }
        }


        [HttpPut("UpdateAdmi")]
        //[Authorize] // 🔐 Descomenta si necesitas protección
        public async Task<IActionResult> UpdateUser([FromBody] Administrador user)
        {
            // if (id != user.User_Id)
            // {
            //     return BadRequest(new { message = "El ID no Coincide" });
            // }
            try
            {
                await _UserServices.UpdateAdmiUserAsync(user);
                return Ok(new { message = "Usuario actualizado correctamente." });
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message }); // Aquí entra si el email ya existe
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Ocurrió un error al actualizar el usuario." });
            }
        }



        // [HttpDelete("{email}")]
        // public async Task<IActionResult> DeleteUser(string email)
        // {
        //     try
        //     {
        //         await _UserServices.DeleteByEmailAsync(email);
        //         return Ok(new { message = "Usuario eliminado correctamente." });
        //     }
        //     catch (KeyNotFoundException ex)
        //     {
        //         return NotFound(new { message = ex.Message });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Error al eliminar el usuario.", details = ex.Message });
        //     }
        // }

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
                // Generar nuevo salt
                string newSalt = PasswordHasher.GenerateSalt();

                // Hashear nueva contraseña con el salt
                string newHashedPassword = PasswordHasher.HashPassword(model.NewPassword, newSalt);

                // Asignar los valores al usuario
                user.Salt = newSalt;
                user.HashedPassword = newHashedPassword;

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
    }

}


