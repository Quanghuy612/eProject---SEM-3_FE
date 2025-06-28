using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class SpecialRechargePackage
    {
        [Key]
        public int SpecialRechargeId { get; set; }

        [Required]
        public required string SpecialRechargeName { get; set; }

        public decimal Price { get; set; }
        public bool IsEnabled { get; set; } = false;

        public virtual ICollection<BillSpecialRechargePackage> BillSpecialRechargePackages { get; set; } = new List<BillSpecialRechargePackage>();
    }
}
