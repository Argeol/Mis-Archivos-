using bienesoft.Models;
using bienesoft.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Bienesoft.Models;
using Bienesoft.Services;
using System.Text.Json;
using bienesoft.Funcions;

var builder = WebApplication.CreateBuilder(args);

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
     {
         builder
         .WithOrigins("http://10.6.96.50:3001") // Asegúrate de poner el origen correcto de tu frontend (puede ser otro puerto si es necesario)
         .AllowAnyMethod()
         .AllowAnyHeader()
         .AllowCredentials(); // Permite el uso de credenciales como cookies
     });
});
// Configurar controladores
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bienesoft API", Version = "v1" });

    // Opcional: Configurar Swagger para que acepte Token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Ingrese el token en el formato: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configurar base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 23)))
);

// Inyección de dependencias de servicios
builder.Services.AddScoped<ApprenticeService>();
builder.Services.AddScoped<FileServices>();
builder.Services.AddScoped<AreaServices>();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<ProgramServices>();
builder.Services.AddScoped<DepartmentService>();
builder.Services.AddScoped<ResponsibleServices>();
builder.Services.AddScoped<PermissionFSService>();
builder.Services.AddScoped<MunicipalityService>();
builder.Services.AddScoped<PermissionApprovalService>();
builder.Services.AddScoped<RoleServices>();
builder.Services.AddScoped<PermissionService>();
builder.Services.AddScoped<GeneralFunction>();
builder.Services.AddScoped<ApprenticeImportService>();

// ---------------------------------
// Configurar JWT
// ---------------------------------

var key = Encoding.UTF8.GetBytes("dkjfnhufuyhrije9ijwibdyu2wuoyhe327y37gey7hiwdbqjwnhbdgcyhbxjdkñlaoeurygdtvsghdbhwejbdjhksydeydbhwbset"); // Debes poner una clave secreta segura

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = "BienesoftAPI",
        ValidAudience = "BienesoftClient",
        ClockSkew = TimeSpan.Zero // Sin tolerancia al reloj
    };

    // Personalizar respuestas en errores de autenticación
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Leer el token de las cookies
            var token = context.Request.Cookies["token"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";

            if (string.IsNullOrEmpty(context.Error))
            {
                context.Error = "No autorizado: falta token";
            }
            if (string.IsNullOrEmpty(context.ErrorDescription))
            {
                context.ErrorDescription = "Esta solución requiere un token de acceso JWT válido.";
            }

            if (context.AuthenticateFailure is SecurityTokenExpiredException expiredException)
            {
                context.Response.Headers.Add("x-token-expired", expiredException.Expires.ToString("o"));
                context.ErrorDescription = $"El token expiró el {expiredException.Expires:o}";
            }

            return context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                error = context.Error,
                error_description = context.ErrorDescription
            }));

        }, // ✅ Manejar el 403 aquí
        OnForbidden = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                message = "No tiene permisos para acceder a este recurso."
            }));
        }
    };
});
// ---------------------------------

var app = builder.Build();


    app.UseSwagger();
    app.UseSwaggerUI();


//app.UseRouting(); // No es obligatorio aquí si usas MapControllers()

app.UseCors("AllowSpecificOrigin"); // Permitir CORS
app.UseAuthentication();            // Autenticación JWT
app.UseAuthorization();             // Autorización de roles, políticas, etc.

app.MapControllers();                // Mapear controladores
app.UseStaticFiles();   //Activa la carpeta wwwrot como pùblica

app.Run();
