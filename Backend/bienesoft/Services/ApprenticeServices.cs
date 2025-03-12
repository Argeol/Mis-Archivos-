using bienesoft.Models;
using Bienesoft.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bienesoft.Services
{
    public class ApprenticeService
    {
        private readonly AppDbContext _context;

        public ApprenticeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Apprentice> GetApprenticeByIdAsync(int id)
        {
            return await _context.apprentice
        .Where(a => a.Id_Apprentice == id)
        .Include(a => a.File)
            .ThenInclude(f => f.program)
                .ThenInclude(p => p.Area)
        .Include(a => a.Municipality) // Aquí no se usa FirstOrDefaultAsync()
        .FirstOrDefaultAsync();
        }
        public async Task<apprenticeDTO> GetPermissionById(int id)
        {
            var apprentice = await _context.apprentice
                .Where(p => p.Id_Apprentice == id)
                .Select(p => new apprenticeDTO
                {
                    First_Name_Apprentice = p.First_Name_Apprentice,
                    Last_Name_Apprentice = p.Last_Name_Apprentice,
                    Email_Apprentice = p.Email_Apprentice,
                    Address_Apprentice = p.Address_Apprentice,
                    Phone_Apprentice = p.Phone_Apprentice,
                    Status_Apprentice = p.Status_Apprentice,
                    MunicipalityName = p.Municipality.municipality,
                    ProgramName = p.File.program.Program_Name,
                    AreaName = p.File.program.Area.Area_Name,
                    nom_department = p.Municipality.Department.Name_department
                })
                .FirstOrDefaultAsync();

            return apprentice;
        }
        public async Task<Apprentice> CreateApprenticeAsync(ApprenticeCreateDTO apprenticeDTO)
        {
            var municipality = await _context.municipality.FindAsync(apprenticeDTO.Municipality_Id);
            var file = await _context.file.FindAsync(apprenticeDTO.File_id);

            if (file == null)
            {
                throw new ArgumentException("la ficha no existe.");
            }
            if (municipality == null)
            {
                throw new ArgumentException("el municipio no existe en la base de datos");

            }
            var apprentice = new Apprentice
            {
                First_Name_Apprentice = apprenticeDTO.First_Name_Apprentice,
                Last_Name_Apprentice = apprenticeDTO.Last_Name_Apprentice,
                Birth_Date_Apprentice = apprenticeDTO.Birth_Date_Apprentice,
                Gender_Apprentice = apprenticeDTO.Gender_Apprentice,
                Email_Apprentice = apprenticeDTO.Email_Apprentice,
                Address_Apprentice = apprenticeDTO.Address_Apprentice,
                Address_Type_Apprentice = apprenticeDTO.Address_Type_Apprentice,
                Phone_Apprentice = apprenticeDTO.Phone_Apprentice,
                Status_Apprentice = apprenticeDTO.Status_Apprentice,
                Permission_Count_Apprentice = apprenticeDTO.Permission_Count_Apprentice,
                Id_Municipality = apprenticeDTO.Municipality_Id,
                File_Id = apprenticeDTO.File_id
            };

            _context.apprentice.Add(apprentice);
            await _context.SaveChangesAsync();

            return apprentice;
        }
    public async Task<Apprentice?> UpdateApprenticeAsync(int id, ApprenticeUpdateDTO apprenticeDTO)
{
    var apprentice = await _context.apprentice.FindAsync(id);

    if (apprentice == null)
    {
        return null; // No se encontró el aprendiz
    }

    // Solo actualiza los campos si el usuario los envía en la petición
    if (!string.IsNullOrEmpty(apprenticeDTO.First_Name_Apprentice))
        apprentice.First_Name_Apprentice = apprenticeDTO.First_Name_Apprentice;

    if (!string.IsNullOrEmpty(apprenticeDTO.Last_Name_Apprentice))
        apprentice.Last_Name_Apprentice = apprenticeDTO.Last_Name_Apprentice;

    if (apprenticeDTO.Birth_Date_Apprentice.HasValue)
        apprentice.Birth_Date_Apprentice = apprenticeDTO.Birth_Date_Apprentice.Value;

    if (!string.IsNullOrEmpty(apprenticeDTO.Gender_Apprentice))
        apprentice.Gender_Apprentice = apprenticeDTO.Gender_Apprentice;

    if (!string.IsNullOrEmpty(apprenticeDTO.Email_Apprentice))
        apprentice.Email_Apprentice = apprenticeDTO.Email_Apprentice;

    if (!string.IsNullOrEmpty(apprenticeDTO.Address_Apprentice))
        apprentice.Address_Apprentice = apprenticeDTO.Address_Apprentice;

    if (!string.IsNullOrEmpty(apprenticeDTO.Address_Type_Apprentice))
        apprentice.Address_Type_Apprentice = apprenticeDTO.Address_Type_Apprentice;

    if (!string.IsNullOrEmpty(apprenticeDTO.Phone_Apprentice))
        apprentice.Phone_Apprentice = apprenticeDTO.Phone_Apprentice;

    if (!string.IsNullOrEmpty(apprenticeDTO.Status_Apprentice))
        apprentice.Status_Apprentice = apprenticeDTO.Status_Apprentice;

    if (apprenticeDTO.Id_Municipality.HasValue)
        apprentice.Id_Municipality = apprenticeDTO.Id_Municipality.Value;

    // 🔹 Forzar a EF Core a detectar cambios
    _context.Entry(apprentice).State = EntityState.Modified;

    await _context.SaveChangesAsync();
    return apprentice;
}

    }


}


// using bienesoft.models;
// using bienesoft.Models;
// using Microsoft.EntityFrameworkCore;
// using System.Collections.Generic;
// using System.Threading.Tasks;

// namespace bienesoft.Services
// {
//     public class ApprenticeService
//     {
//         private readonly AppDbContext _context;

//         public ApprenticeService(AppDbContext context)
//         {
//             _context = context;
//         }

//         // Obtener todos los aprendices
//         public async Task<List<Apprentice>> GetApprenticesAsync()
//         {
//             return await _context.apprentice.ToListAsync();
//         }

//         // Registrar un nuevo aprendiz
//         public async Task<bool> RegisterApprenticeAsync(Apprentice apprentice)
//         {
//             // Validamos si el municipio existe (Usamos WHERE)
//             var municipalityExists = await _context.municipality
//                 .AnyAsync(m => m.Id_municipality == apprentice.Id_Municipality);

//             if (!municipalityExists)
//             {
//                 return false; // ❌ No se puede registrar porque el municipio no existe
//             }

//             // Agregamos el aprendiz a la base de datos
//             await _context.apprentice.AddAsync(apprentice);
//             await _context.SaveChangesAsync();
//             return true; // ✅ Registro exitoso
//         }
//     }
// }

// // using bienesoft.Models;
// // using Bienesoft.Models;

// // namespace bienesoft.Services
// // {
// //     public class ApprenticeServices
// //     {
// //         private readonly AppDbContext _context;
// //         public ApprenticeServices(AppDbContext context)
// //         {
// //             _context = context;
// //         }
// //         public IEnumerable<Apprentice> AllApprentice() 
// //         { 
// //             return _context.apprentice.ToList();
// //         }
// //         public void AddApprendice(Apprentice apprentice)
// //         { 
// //             _context.apprentice.Add(apprentice);
// //             _context.SaveChanges();
// //         }
// //         public Apprentice GetById(int id)
// //         {
// //             return _context.apprentice.FirstOrDefault(p => p.Id_Apprentice == id);
// //         }
// //         public void Delete(int id)
// //         {
// //             var apprentice = _context.apprentice.FirstOrDefault(p => p.Id_Apprentice == id);
// //             if (apprentice != null) 
// //             {
// //                 try
// //                 {
// //                     _context.apprentice.Remove(apprentice);
// //                     _context.SaveChanges();
// //                 }
// //                 catch (Exception ex) 
// //                 {
// //                     throw new Exception("No Se Pudo Eliminar El Aprendiz" + ex.Message);
// //                 }
// //             }
// //             else
// //             {
// //                 throw new KeyNotFoundException("El Apprentice Con El Id" + id + "No Se Pudo Encontrar");
// //             }
// //         }
// //         public void UpdateApprentice(Apprentice apprentice)
// //         {
// //             if (apprentice == null)
// //             {
// //                 throw new ArgumentNullException(nameof(Apprentice), "El modelo de Apprentice es nulo");
// //             }

// //             var existingApprentice = _context.apprentice.Find(apprentice.Id_Apprentice);
// //             if (existingApprentice == null)
// //             {
// //                 throw new ArgumentException("Apprentice no encontrado");
// //             }

// //             existingApprentice.Last_Name_Apprentice = apprentice.Last_Name_Apprentice;
// //             // Actualiza otros campos según sea necesario

// //             _context.SaveChanges();
// //         }
// //         public IEnumerable<Apprentice> GetApprenticeByCriteria(string criteria)
// //         {
// //             return _context.apprentice
// //                 .Where(a => a.Last_Name_Apprentice.Contains(criteria)) // Puedes modificar esta línea según el criterio
// //                 .ToList();
// //         }
// //     }
// // }
