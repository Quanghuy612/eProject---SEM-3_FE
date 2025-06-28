using Microsoft.AspNetCore.Authorization;
using server.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class TransactionController : BaseApiController
{
    private readonly TransactionService _transactionService;

    public TransactionController(TransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost("pay-bills")]
    public async Task<IActionResult> PayBills([FromBody] PayBillsRequestDto request)
    {
        var phoneNumber = User.Claims.FirstOrDefault(c => c.Type == "PhoneNumber")?.Value;

        if (string.IsNullOrEmpty(phoneNumber))
        {
            return ToActionResult(ApiResponse.Error(400, "Phone number not found in token"));
        }

        var result = await _transactionService.PayBillsAsync(request, phoneNumber);
        return ToActionResult(result);
    }

    [HttpGet("my-transactions")]
    public async Task<IActionResult> GetMyTransactions([FromQuery] DateTime? fromDate, DateTime? toDate, int? currentPage)
    {
        var phoneNumber = User.Claims.FirstOrDefault(c => c.Type == "PhoneNumber")?.Value;

        if (string.IsNullOrEmpty(phoneNumber))
        {
            return ToActionResult(ApiResponse.Error(400, "Phone number not found in token"));
        }

        var result = await _transactionService.GetTransactionsByPhoneNumberAsync(
            phoneNumber,
            fromDate,
            toDate,
            currentPage ?? 1
        );

        return ToActionResult(result);
    }
}
