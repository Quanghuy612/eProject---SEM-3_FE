using Microsoft.AspNetCore.Authorization;

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]

    public class AuthController : BaseApiController
    {
        private AuthServices _authServices;

        public AuthController(AuthServices authServices)
        {
            _authServices = authServices;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            string role = "user";
            var result = await _authServices.LoginAsync(request, role);
            return ToActionResult(result);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            var result = await _authServices.SignUpAsync(request);
            return ToActionResult(result);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogOut([FromBody] RefreshTokenRequest request)
        {
            var result = await _authServices.LogOutAsync(request.RefreshToken);
            return ToActionResult(result);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var result = await _authServices.RefreshTokenAsync(request.RefreshToken);
            return ToActionResult(result);
        }
    }
}
