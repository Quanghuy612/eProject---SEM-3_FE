namespace server.DTOs.BillDTO
{
    public class BillResponseDto
    {
        public int BillId { get; set; }

        public string PhoneNumber { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public DateTime DueDate { get; set; }

        public bool IsPaid { get; set; }

        public int? TopUpId { get; set; }

        public int? TransactionId { get; set; }
    }
}
