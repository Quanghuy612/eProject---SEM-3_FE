using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]

    public class RechargeController : BaseApiController
    {
        private RechargeServices _rechargeServices;

        public RechargeController(RechargeServices rechargeServices)
        {
            _rechargeServices = rechargeServices;
        }

        [HttpPost("get-otp")]
        public async Task<IActionResult> GetOtp([FromBody] VertifyPhoneRequest request)
        {
            var result = await _rechargeServices.GetOtpAsync(request);
            return ToActionResult(result);
        }

        [HttpPost("vertify-otp")]
        public async Task<IActionResult> VertifyOtp([FromBody] VertifyPhoneRequest request)
        {
            var result = await _rechargeServices.VeritifyOtpAsync(request);
            return ToActionResult(result);
        }

        [Authorize]
        [HttpPost("vertify-user")]
        public async Task<IActionResult> VertifyUser([FromBody] VertifyPhoneRequest request)
        {
            var result = await _rechargeServices.VertifyUserAsync(request);
            return ToActionResult(result);
        }

        [HttpGet("online-recharge")]
        public async Task<IActionResult> GetOnlineRecharge()
        {
            var result = await _rechargeServices.GetOnlineRechargeAsync();
            return ToActionResult(result);
        }

        [HttpGet("special-recharge")]
        public async Task<IActionResult> GetSpecialRecharge()
        {
            var result = await _rechargeServices.GetSpecialRechargeAsync();
            return ToActionResult(result);
        }
    }
}
