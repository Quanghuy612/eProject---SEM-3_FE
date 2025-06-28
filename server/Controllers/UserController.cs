    using Microsoft.AspNetCore.Mvc;
    using server.DTOs.UserDTO;
    using server.Models;
    using server.Services;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;

    namespace server.Controllers
    {

        [ApiController]
        [Route("api/v1/[controller]")]
        public class UsersController : BaseApiController
    {
            private readonly UserServices _userService;

            public UsersController(UserServices userService)
            {
                _userService = userService;
            }

            // GET: api/users/{id}
            [Authorize]
            [HttpGet("{id}")]
            public async Task<IActionResult> GetUserById(int id)
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null) return NotFound();

                return Ok(user);
            }

        // GET: api/users/username/{username}
        [Authorize]
        [HttpGet("username/{username}")]
        public async Task<IActionResult> GetUserByUsername(string username)
        {
            var user = await _userService.GetUserByUsernameAsync(username);
            if (user == null) return NotFound();

            return Ok(user);
        }


        // PUT: api/users/{id}
        [Authorize]
            [HttpPut("{id}")]
            public async Task<IActionResult> UpdateUser(int id, UserUpdateDto dto)
            {
                var success = await _userService.UpdateUserAsync(id, dto);
                if (!success) return NotFound();

                return NoContent();
            }
        }
    }
