using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.ApiResponseDTO;
using server.DTOs.BillDTO;
using server.Services;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class BillController : BaseApiController
    {
        private readonly BillService _billService;
        private readonly TransactionService _transactionService;

        public BillController(BillService billService, TransactionService transactionService)
        {
            _billService = billService;
            _transactionService = transactionService;
        }

        [HttpPost("guest-pay-bills")]
        public async Task<IActionResult> GuestPayBill([FromBody] CreateBillDto createBillDto)
        {
            var result = await _billService.GuestPayBill(createBillDto);
            return ToActionResult(result);
        }

        [HttpPost("special-recharge-bill")]
        public async Task<IActionResult> CreateSpecialRechargeBill([FromBody] CreateBillDto createBillDto)
        {
            var result = await _billService.CreateSpecialRechargeBill(createBillDto);
            return ToActionResult(result);
        }

        [HttpPost("special-service-bill")]
        public async Task<IActionResult> CreateSpecialServiceBill([FromBody] CreateBillDto createBillDto)
        {
            var result = await _billService.CreateSpecialServiceBill(createBillDto);
            return ToActionResult(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateBill([FromBody] CreateBillDto createBillDto)
        {
            var result = await _billService.CreateBillAsync(createBillDto);
            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBillById(int id)
        {
            var result = await _billService.GetBillByIdAsync(id);
            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllBills()
        {
            var result = await _billService.GetAllBillsAsync();
            return ToActionResult(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBill(int id, [FromBody] UpdateBillDto updateBillDto)
        {
            var result = await _billService.UpdateBillAsync(id, updateBillDto, User);
            return ToActionResult(result);
        }

        [Authorize]
        [HttpGet("my-bills")]
        public async Task<IActionResult> GetBillsOfCurrentUser([FromQuery] DateTime? fromDate, DateTime? toDate, bool? isPaid, int? currentPage)
        {
            var phoneNumber = User.Claims.FirstOrDefault(c => c.Type == "PhoneNumber")?.Value;

            if (string.IsNullOrEmpty(phoneNumber))
            {
                return ToActionResult(ApiResponse.Error(400, "Phone number not found in token"));
            }

            var result = await _billService.GetBillsByPhoneNumberAsync(
                phoneNumber,
                fromDate,
                toDate,
                isPaid,
                currentPage ?? 1
            );

            return ToActionResult(result);
        }

        [Authorize]
        [HttpPost("pay-bills")]
        public async Task<IActionResult> PayBills([FromBody] List<int> billIds)
        {
            var result = await _transactionService.PayBillsAsync(billIds);
            return ToActionResult(result);
        }

    }
}
