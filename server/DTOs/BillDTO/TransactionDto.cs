namespace server.DTOs.BillDTO
{
    public class TransactionDto
    {
        public int TransactionId { get; set; }
        public string PhoneNumber { get; set; }
        public string TransactionDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; }
    }
}
