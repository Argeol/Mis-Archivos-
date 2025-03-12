using Bienesoft.Models;
namespace bienesoft.Models
{
    public class ReasonServices
    {
        private readonly AppDbContext _context;

        public ReasonServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Reason> GetReason()
        {
            return _context.reason.ToList();
        }

        public void AddReason(Reason reason)
        {
            _context.reason.Add(reason);
            _context.SaveChanges();
        }
        public Reason GetById(int id)
        {
            return _context.reason.FirstOrDefault(p => p.Reason_Id == id);
        }
        public void Delete(int id)
        {
            var reason = _context.reason.FirstOrDefault(p => p.Reason_Id == id);
            if (reason != null)
            {
                try
                {
                    _context.reason.Remove(reason);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw new Exception("No Se Pudo Eliminar El Motivo" + ex.Message);
                }
            }
            else
            {
                throw new KeyNotFoundException("El Motivo Con El Id" + id + "No Se Pudo Encontrar");
            }
        }

        public void UpdateReason(Reason reason)
        {
            if (reason == null)
            {
                throw new ArgumentNullException(nameof(Reason), "El modelo de Motivo es nulo");
            }

            var existingReason = _context.reason.Find(reason.Reason_Id);
            if (existingReason == null)
            {
                throw new ArgumentException("Motivo no encontrado");
            }

            existingReason.Tip_Reason = reason.Tip_Reason;
            // Actualiza otros campos según sea necesario

            _context.SaveChanges();
        }

    }
}



