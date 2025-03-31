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

        public Area GetById(int id)
        {
            return _context.area.FirstOrDefault(p => p.Area_Id == id);
        }
    }
}
    

