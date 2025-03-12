// using bienesoft.Models;
// using Bienesoft.Models;
// using Microsoft.EntityFrameworkCore;
// using System.Collections.Generic;
// using System.Linq;

// namespace Bienesoft.Services
// {
//     public class LocalityServices
//     {
//         private readonly AppDbContext _context;

//         public LocalityServices(AppDbContext context)
//         {
//             _context = context;
//         }

//         public IEnumerable<Locality> GetLocalities()
//         {
//             return _context.locality.Include(p => p.department).ToList(); // Asegúrate de que 'locality' es el DbSet correcto en tu contexto.
//         }

//         public void AddLocality(Locality locality)
//         {
//             _context.locality.Add(locality); // Asegúrate de que 'locality' es el DbSet correcto.
//             _context.SaveChanges();
//         }

//         public Locality GetById(int id)
//         {
//             return _context.locality.FirstOrDefault(l => l.Locality_Id == id); // Asegúrate de que 'locality' es el DbSet correcto.
//         }

//         public void Delete(int id)
//         {
//             var locality = _context.locality.FirstOrDefault(l => l.Locality_Id == id); // Asegúrate de que 'locality' es el DbSet correcto.
//             if (locality != null)
//             {
//                 try
//                 {
//                     _context.locality.Remove(locality); // Asegúrate de que 'locality' es el DbSet correcto.
//                     _context.SaveChanges();
//                 }
//                 catch (Exception ex)
//                 {
//                     throw new Exception("No se pudo eliminar la localidad: " + ex.Message);
//                 }
//             }
//             else
//             {
//                 throw new KeyNotFoundException("La localidad con el ID " + id + " no se pudo encontrar.");
//             }
//         }

//         public void UpdateLocality(Locality locality)
//         {
//             if (locality == null)
//             {
//                 throw new ArgumentNullException(nameof(locality), "El modelo de Localidad es nulo");
//             }

//             var existingLocality = _context.locality.Find(locality.Locality_Id); // Asegúrate de que 'locality' es el DbSet correcto.
//             if (existingLocality == null)
//             {
//                 throw new ArgumentException("Localidad no encontrada");
//             }

//             existingLocality.Locality_Name = locality.Locality_Name;
//             existingLocality.Locality_Type = locality.Locality_Type;
//             existingLocality.Department_Id = locality.Department_Id;

//             _context.SaveChanges();
//         }
//     }
// }