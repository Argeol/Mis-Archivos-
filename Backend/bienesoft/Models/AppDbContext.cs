using bienesoft.models;
using Bienesoft.Models;
using Microsoft.EntityFrameworkCore;

namespace bienesoft.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //Agrega tus DbSet para las entidades
        public DbSet<Apprentice> apprentice { get; set; }
        public DbSet<FileModel> file { get; set; }
        public DbSet<Area> area { get; set; }

        public DbSet<ProgramModel> program { get; set; }
        public DbSet<User> user { get; set; }
        public DbSet<Department> department { get; set; }
        public DbSet<Locality> locality { get; set; }
        // public DbSet<AuthorizationResponsible> authorizationResponsible { get; set; }
        public DbSet<PermissionFS> permissionFS { get; set; }
        public DbSet<Reason> reason { get; set; }
        // public DbSet<Responsible> responsible { get; set; }
        public DbSet<PermissionGN> permissionGN { get; set; }
        public DbSet<PermissionApproval> permissionApproval { get; set; }

        public DbSet<Responsible> responsible { get; set; }

        public DbSet<Role> role { get; set; }

        public DbSet<Municipality> municipality { get; set; }




        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("Server=localhost;Database=Bienesoft;User=root;Password=elzurdojrprom2019;Port=3306",
                    new MySqlServerVersion(new Version(8, 0, 23)));
            }

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // foreach (var entity in modelBuilder.Model.GetEntityTypes())
            // {
            //     entity.SetTableName(entity.GetTableName().ToLower());
            // }
            modelBuilder.Entity<Role>().HasData(
                new Role { Id_role = 1, Name_role = "Instructor" },
                new Role { Id_role = 2, Name_role = "Coordinator" },
                new Role { Id_role = 3, Name_role = "WelfareLeader" },
                new Role { Id_role = 4, Name_role = "AccommodationManager" }
            );

            // Relación Departamento -> Municipios (1 a muchos)
            modelBuilder.Entity<Department>()
                .HasMany(d => d.municipality)
                .WithOne(m => m.Department)
                .HasForeignKey(m => m.Id_department)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación Municipio -> Aprendiz (1 a muchos)
            modelBuilder.Entity<Municipality>()
                .HasMany(m => m.apprentice)  // Un municipio tiene muchos aprendices
                .WithOne(a => a.Municipality) // Un aprendiz tiene un municipio
                .HasForeignKey(a => a.Id_Municipality)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Apprentice>()
                .HasOne(a => a.File)
                .WithMany(f => f.Apprentice)
                .HasForeignKey(a => a.File_Id);

            // Relación File -> Program
            modelBuilder.Entity<FileModel>()
                .HasOne(f => f.program)
                .WithMany(p => p.FileModels)
                .HasForeignKey(f => f.Program_Id);

            // Relación Program -> Area
            modelBuilder.Entity<ProgramModel>()
                .HasOne(p => p.Area)
                .WithMany(a => a.Programs)
                .HasForeignKey(p => p.Area_Id);

            modelBuilder.Entity<PermissionGN>()
                .HasOne(p => p.Apprentice)  // Un aprendiz tiene muchos permisos
                .WithMany(a => a.PermissionGN)     // Un permiso pertenece a un aprendiz
                .HasForeignKey(p => p.Id_Apprentice)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PermissionApproval>()
                .HasOne(pa => pa.Permission)       // Una aprobación pertenece a un permiso
                .WithMany(p => p.Approvals)        // Un permiso puede tener muchas aprobaciones
                .HasForeignKey(pa => pa.PermissionId) // Clave foránea en PermissionApproval
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PermissionApproval>()
                .HasOne(pa => pa.Responsible)       // Una aprobación pertenece a un responsable
                .WithMany(r => r.PermissionApprovals) // Un responsable puede aprobar muchas solicitudes
                .HasForeignKey(pa => pa.ResponsibleId) // Clave foránea en PermissionApproval
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
        }

    }

}
