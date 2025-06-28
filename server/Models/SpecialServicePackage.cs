using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class SpecialServicePackage
    {
        [Key]
        public int SpecialServiceId { get; set; }

        [Required]
        public required string SpecialServiceName { get; set; }

        public decimal Price { get; set; }
        public bool IsEnabled { get; set; } = false;

        public virtual ICollection<BillSpecialServicePackage> BillSpecialServicePackages { get; set; } = new List<BillSpecialServicePackage>();
    }
}
