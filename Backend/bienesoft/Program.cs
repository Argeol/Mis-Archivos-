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

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bienesoft API", Version = "v1" });

    //    // requerir autorizaci�n

    //c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    //{
    //    In = ParameterLocation.Header,
    //    Description = "Ingrese el token en el formato: Bearer {token}",
    //    Name = "Authorization",
    //    Type = SecuritySchemeType.ApiKey
    //});

    //c.AddSecurityRequirement(new OpenApiSecurityRequirement
    //    {
    //        {
    //            new OpenApiSecurityScheme
    //            {
    //                Reference = new OpenApiReference
    //                {
    //                    Type = ReferenceType.SecurityScheme,
    //                    Id = "Bearer"
    //                }
    //            },
    //            new string[] {}
    //        }
    //    });
});

// Configurar base de datos
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 23)))
);

// Configurar servicios
builder.Services.AddScoped<ApprenticeService>();
builder.Services.AddScoped<FileServices>();
builder.Services.AddScoped<AreaServices>();
// builder.Services.AddScoped<PermissionServices>();
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<ProgramServices>();
builder.Services.AddScoped<DepartmentService>();
// builder.Services.AddScoped<LocalityServices>();
// builder.Services.AddScoped<AuthorizationResponsibleServices>();
builder.Services.AddScoped<ResponsibleServices>();
builder.Services.AddScoped<PermissionFSServices>();
// builder.Services.AddScoped<PermissionService>();
builder.Services.AddScoped<MunicipalityService>();
builder.Services.AddScoped<ApprovalService>();
builder.Services.AddScoped<RoleServices>();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});



// Configurar JWT
//var key = Encoding.UTF8.GetBytes(builder.Configuration["JWT:keysecret"]);
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuerSigningKey = true,
//        IssuerSigningKey = new SymmetricSecurityKey(key),
//        ValidateIssuer = false,
//        ValidateAudience = false,
//        ClockSkew = TimeSpan.Zero
//    };
//    options.Events = new JwtBearerEvents()
//    {
//        OnChallenge = context =>
//        {
//            context.HandleResponse();
//            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//            context.Response.ContentType = "application/json";
//            if (string.IsNullOrEmpty(context.Error))
//            {                
//                context.Error = "No autorizado: falta token";
//            }
//            if (string.IsNullOrEmpty(context.ErrorDescription))
//                context.ErrorDescription = "Esta solucion requiere que se proporsione un token de acceso JWT valido";

//            if(context.AuthenticateFailure != null && context.AuthenticateFailure.GetType() == typeof(SecurityTokenExpiredException))
//            {
//                var authenticationException = context.AuthenticateFailure as SecurityTokenExpiredException;
//                context.Response.Headers.Add("x-token-expired", authenticationException.Expires.ToString("o"));
//                context.ErrorDescription = $"El token expiro el{authenticationException.Expires.ToString("o")}";

//            }
//            return context.Response.WriteAsync(JsonSerializer.Serialize(new
//            {
//                error = context.Error,
//                error_description = context.ErrorDescription
//            }));
//        }
//    };
//});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseRouting(); // Primero, establece el enrutamiento
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication(); // Luego, aplica la autenticaci�n
app.UseAuthorization(); // Despu�s, aplica la autorizaci�n


app.MapControllers(); // Finalmente, mapea los controladores

app.Run();
