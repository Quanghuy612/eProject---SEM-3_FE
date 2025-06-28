using System.ComponentModel.DataAnnotations;

namespace server.DTOs.BillDTO
{
    public class CreateBillDto
    {
        [Required, MaxLength(10)]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "TotalAmount must be positive.")]
        public decimal TotalAmount { get; set; }

        public DateTime DueDate { get; set; }

        public int TopUpId { get; set; }

        public int TransactionId { get; set; }
        public string? PayMentMethod { get; set; }
    }
}
