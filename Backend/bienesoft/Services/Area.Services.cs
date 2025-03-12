using Bienesoft.Models;
namespace bienesoft.Models
{
    public class AreaServices
    {
        private readonly AppDbContext _context;

        public AreaServices(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable <Area> GetArea()
        {
            return _context.area.ToList();
        }

        public void AddArea(Area area)
        {
            _context.area.Add(area);
            _context.SaveChanges();
        }
        public Area GetById(int id)
        {
            return _context.area.FirstOrDefault(p => p.Area_Id == id);
        }
        public void Delete(int id)
        {
            var area = _context.area.FirstOrDefault(p => p.Area_Id == id);
            if (area != null)
            {
                try
                {
                    _context.area.Remove(area);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    throw new Exception("No Se Pudo Eliminar El Area" + ex.Message);
                }
            }
            else
            {
                throw new KeyNotFoundException("El Area Con El Id" + id + "No Se Pudo Encontrar");
            }
        }

        public void UpdateArea(Area area)
        {
            if (area == null)
            {
                throw new ArgumentNullException(nameof(Area), "El modelo de Area es nulo");
            }

            var existingArea = _context.area.Find(area.Area_Id);
            if (existingArea == null)
            {
                throw new ArgumentException("Area no encontrado");
            }

            existingArea.Area_Name = area.Area_Name;
            // Actualiza otros campos según sea necesario

            _context.SaveChanges();
        }

    }
}
    

