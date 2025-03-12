using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using bienesoft.Services; // Asegúrate de usar el servicio adecuado
using System;
using bienesoft.Funcions;
using Microsoft.AspNetCore.Authorization;
using bienesoft.Models;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _key;
    private readonly GeneralFunction _GeneralFunction;
    private readonly IConfiguration _configuration;
    private readonly List<string> _publicRouter;


    public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _configuration = configuration;
        _next = next;
        _key = configuration.GetSection("JWT").GetValue<string>("keysecret");
        _GeneralFunction = new GeneralFunction(_configuration);
        _publicRouter = _configuration.GetSection("RoutePublic").Get<List<RouteConfig>>().Select(route => route.Route).ToList();
    }

    public async Task Invoke(HttpContext context, UserServices userService)
    {
        // Verificar si el endpoint permite acceso anónimo
        var endpoint = context.GetEndpoint();
        var allowAnonymous = endpoint?.Metadata
            .GetMetadata<IAllowAnonymous>() != null;

        // Si el endpoint permite acceso anónimo, no validamos el token
        if (!allowAnonymous)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            var path = context.Request.Path;
            if (_publicRouter.Contains(path))
            {
                await _next(context);
                return;
            }
            if (token != null)
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "aplication/json";
                await context.Response.WriteAsync(":{\"error\": \"Token no proporcionado.\"}");
                return;
            }
            if (!AttachUserToContext(context, userService, token))
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "aplication/json";
                await context.Response.WriteAsync("{\"error\": \"Token invalido o no autorizado. \"}");
                return;
            }
            await _next(context);
            return;
        }

        await _next(context);
    }

    private bool AttachUserToContext(HttpContext context, UserServices userService, string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_key);
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userEmail = jwtToken.Claims.First(x => x.Type == "User").Value;

            // Adjuntar el usuario al contexto si la validación del token es correcta
            context.Items["User"] = userService.GetByEmailAsync(userEmail).Result;
            return true;
        }
        catch (Exception ex)
        {
            _GeneralFunction.Addlog(ex.Message);
            return false;
        }
    }
}

