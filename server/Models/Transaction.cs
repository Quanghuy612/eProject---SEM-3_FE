using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public required string PhoneNumber { get; set; }

        public DateTime TransactionDate { get; set; }

        [Required]
        public required decimal TotalAmount { get; set; }

        public DateTime? PaymentDate { get; set; }

        public required string PaymentMethod { get; set; }

        public virtual ICollection<Bill> Bills { get; set; } = new List<Bill>();
    }

}
