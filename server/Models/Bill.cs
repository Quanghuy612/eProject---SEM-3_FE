using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Bill
    {
        [Key]
        public int BillId { get; set; }

        [Required, MaxLength(10)]
        public required string PhoneNumber { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        public DateTime DueDate { get; set; }

        public bool IsPaid { get; set; }

        public int? TransactionId { get; set; } // Cho phép null

        public virtual Transaction? Transaction { get; set; } // Navigation property

        public virtual ICollection<BillSpecialRechargePackage> BillSpecialRechargePackages { get; set; } = new List<BillSpecialRechargePackage>();

        public virtual ICollection<BillSpecialServicePackage> BillSpecialServicePackages { get; set; } = new List<BillSpecialServicePackage>();

        public int? TopUpId { get; set; }

        public virtual TopUpPackage? TopUps { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }

}
