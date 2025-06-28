public class PayBillsRequestDto
{
    public required List<int> BillIds { get; set; }
    public required string PaymentMethod { get; set; }  // Ví d?: "CreditCard", "BankTransfer"
}
