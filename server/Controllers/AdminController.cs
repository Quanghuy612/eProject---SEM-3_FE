using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]

    public class AdminController : BaseApiController
    {
        private AdminServices _adminServices;

        public AdminController(AdminServices adminServices)
        {
            _adminServices = adminServices;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            string role = "admin";
            var result = await _adminServices.LoginAsync(request, role);
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("caculate-total")]
        public async Task<IActionResult> CaculateTotal()
        {
            var result = await _adminServices.CaculateTotalAsync();
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("caculate-services")]
        public async Task<IActionResult> CaculateServices()
        {
            var result = await _adminServices.CaculateServicesAsync();
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("bills")]
        public async Task<IActionResult> GetBills([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] bool? isPaid)
        {
            var result = await _adminServices.GetBillsAsync(fromDate, toDate, isPaid);
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactions([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var result = await _adminServices.GetTransactionsAsync(fromDate, toDate);
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("packages")]
        public async Task<IActionResult> GetPackages()
        {
            var result = await _adminServices.GetPackagesAsync();
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _adminServices.GetUsersAsync();
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("feedbacks")]
        public async Task<IActionResult> GetFeedbacks()
        {
            var result = await _adminServices.GetFeedbacksAsync();
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("feedbacks/{id}/approve")]
        public async Task<IActionResult> ApproveFeedback(int id)
        {
            var result = await _adminServices.ApproveFeedbackAsync(id);
            return ToActionResult(result);
        }

        [HttpPatch("feedbacks/{id}/close")]
        public async Task<IActionResult> CloseFeedback(int id)
        {
            var result = await _adminServices.CloseFeedbackAsync(id);
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("packages/{type}/{id}/{actionType}")]
        public async Task<IActionResult> TogglePackage(string type, int id, string actionType)
        {
            var result = await _adminServices.TogglePackageAsync(id, type, actionType);
            return ToActionResult(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("packages")]
        public async Task<IActionResult> AddPackage([FromBody] CreateSpecialSvcPackgeDto data)
        {
            var result = await _adminServices.AddPackageAsync(data);
            return ToActionResult(result);
        }
    }
}
