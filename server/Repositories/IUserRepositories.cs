using server.DTOs.UserDTO;
using server.Models;
using System.Threading.Tasks;

namespace server.Repositories
{
    public interface IUserRepositories
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<bool> UpdateUserAsync(int id, UserUpdateDto dto);
        Task UpdateUserAsync(User user);
        Task<User?> GetUserByUsernameAsync(string username);

    }
}
