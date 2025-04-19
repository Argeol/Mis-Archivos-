// using bienesoft.Models;
// using System.Collections.Generic;
// using System.IO;
// using System.Linq;
// using Microsoft.EntityFrameworkCore;
// using Bienesoft.Services;

// namespace bienesoft.Services
// {
//     public class PermissionFSServices
//     {
//         private readonly AppDbContext _context;
//         private readonly ApprenticeService _apprenticeService;

//         public PermissionFSServices(AppDbContext context, ApprenticeService apprenticeService)
//         {
//             _context = context;
//             _apprenticeService = apprenticeService;
//         }

//         public IEnumerable<object> AllPermissionFSWithApprentice()
//         {
//             return _context.permissionFS
//                 .Select(p => new
//                 {
//                     p.PermissionFS_Id,
//                     p.Description,
//                     p.Exit_Date,
//                     p.Entry_Date,
//                     p.Apprentice_Id,
//                     Apprentice = _apprenticeService.GetApprenticeById(p.Apprentice_Id)
//                 })
//                 .ToList();
//         }

//         public object GetByIdWithApprentice(int id)
//         {
//             var permission = _context.permissionFS.FirstOrDefault(p => p.PermissionFS_Id == id);
//             if (permission == null) return null;

//             return new
//             {
//                 permission.PermissionFS_Id,
//                 permission.Description,
//                 permission.Exit_Date,
//                 permission.Entry_Date,
//                 permission.Apprentice_Id,
//                 Apprentice = _apprenticeService.GetApprenticeById(permission.Apprentice_Id)
//             };
//         }

//         public void AddPermissionFS(PermissionFS permission)
//         {
//             _context.permissionFS.Add(permission);
//             _context.SaveChanges();
//         }

//         public void UpdatePermissionFS(PermissionFS permission)
//         {
//             _context.permissionFS.Update(permission);
//             _context.SaveChanges();
//         }

//         public void UpdateSingleField(int id, Dictionary<string, object> updateData)
//         {
//             var permission = _context.permissionFS.Find(id);
//             if (permission == null)
//                 throw new KeyNotFoundException($"El permiso con ID {id} no fue encontrado.");

//             var entry = _context.Entry(permission);

//             foreach (var item in updateData)
//             {
//                 var property = entry.Property(item.Key);
//                 if (property != null)
//                 {
//                     property.CurrentValue = Convert.ChangeType(item.Value, property.Metadata.ClrType);
//                     property.IsModified = true;
//                 }
//             }

//             _context.SaveChanges();
//         }

//         public void Delete(int id)
//         {
//             var permission = _context.permissionFS.Find(id);
//             if (permission != null)
//             {
//                 _context.permissionFS.Remove(permission);
//                 _context.SaveChanges();
//             }
//         }

//         public MemoryStream ExportPermissionFSToExcel()
//         {
//             var data = _context.permissionFS
//                 .Include(p => p.Apprentice)
//                 .ToList();

//             var totalSalidas = _context.permissionFS
//                 .Count(p => p.Exit_Date != null);

//             excelPackage.LicenseContext = LicenseContext.NonCommercial;
//             var stream = new MemoryStream();

//             using (var package = new ExcelPackage(stream))
//             {
//                 var worksheet = package.Workbook.Worksheets.Add("Permisos");
//                 worksheet.Cells.LoadFromCollection(data.Select(p => new
//                 {
//                     p.PermissionFS_Id,
//                     p.Description,
//                     p.Exit_Date,
//                     p.Entry_Date,
//                     p.Apprentice_Id,
//                     Total_Aprendices_Que_Salieron = totalSalidas
//                 }), true);
//                 package.Save();
//             }

//             stream.Position = 0;
//             return stream;
//         }
//     }
// }
