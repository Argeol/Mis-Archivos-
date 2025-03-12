using Bienesoft.Models;
namespace bienesoft.Models
{
    public class ResponsibleServices
    {
        private readonly AppDbContext _context;

        public ResponsibleServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Responsible> GetResponsible()
        {
            return _context.responsible.ToList();
        }

        public void AddResponsible(Responsible responsible)
        {
            _context.responsible.Add(responsible);
            _context.SaveChanges();
        }
        public Responsible GetById(int id)
        {
            return _context.responsible.FirstOrDefault(p => p.Responsible_Id == id);
        }
        public void Delete(int id)
        {
            var responsible = _context.responsible.FirstOrDefault(p => p.Responsible_Id == id);
            if (responsible != null)
            {
                try
                {
                    _context.responsible.Remove(responsible);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw new Exception("No Se Pudo Eliminar El Responsable" + ex.Message);
                }
            }
            else
            {
                throw new KeyNotFoundException("El Responsable Con El Id" + id + "No Se Pudo Encontrar");
            }
        }

        public void UpdateResponsible(Responsible responsible)
        {
            if (responsible == null)
            {
                throw new ArgumentNullException(nameof(Responsible), "El modelo de responsable es nulo");
            }

            var existingResponsible = _context.responsible.Find(responsible.Responsible_Id);
            if (existingResponsible == null)
            {
                throw new ArgumentException("Responsable no encontrado");
            }

            existingResponsible.Nom_Responsible = responsible.Nom_Responsible;
            // Actualiza otros campos según sea necesario

            _context.SaveChanges();
        }
    }
}