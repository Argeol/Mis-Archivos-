using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace bienesoft.Models
{
    public class Role
    {
        [Key]
        public int Id_role { get; set; }
        public string Name_role { get; set; }

        public ICollection<ResponsibleModel> Responsibles { get; set; }
    }
}
