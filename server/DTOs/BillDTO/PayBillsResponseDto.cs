public class PayBillsResponseDto
{
    public int TransactionId { get; set; }
    public List<int> PaidBillIds { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; }
    public string PhoneNumber { get; set; }
    public string TransactionDateTime { get; set; }
}
