using server.DTOs.UserDTO;
using server.Models;
using server.Repositories;
using System.Threading.Tasks;

namespace server.Services
{
    public class UserServices
    {
        private readonly IUserRepositories _userRepo;

        public UserServices(IUserRepositories userRepositories)
        {
            _userRepo = userRepositories;
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepo.GetUserByIdAsync(id);
            if (user == null) return null;

            return new UserResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                PhoneNumber = user.PhoneNumber,
                Fullname = user.Fullname,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<UserResponseDto?> GetUserByUsernameAsync(string username)
        {
            var user = await _userRepo.GetUserByUsernameAsync(username);
            if (user == null) return null;

            return new UserResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                PhoneNumber = user.PhoneNumber,
                Fullname = user.Fullname,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<bool> UpdateUserAsync(int id, UserUpdateDto dto)
        {
            return await _userRepo.UpdateUserAsync(id, dto);
        }

        public async Task UpdateUserEntityAsync(User user)
        {
            await _userRepo.UpdateUserAsync(user);
        }
    }
}
