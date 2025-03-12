namespace Bienesoft.ProductionDTOs
{
    public class ApprovalDto
    {
        public int Id { get; set; }
        public string ApprovalDate { get; set; }
        public List<PermissionDto> Permissions { get; set; }
    }

    public class PermissionDto
    {
        public int Id { get; set; }  // Se renombra para mantener consistencia con la entidad
        public string Name { get; set; }  
        
        public string Status {get;set;}// Se añade el nombre correctamente
    }
}
