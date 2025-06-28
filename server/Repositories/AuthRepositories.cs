
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace server.Repositories
{
    public interface IAuthRepositories
    {
        Task SaveTokenMemory(string token);

        Task ClearTokenMemory();

        Task<User?> GetUserByUsernamec(string username, string role);

        Task<User?> GetExistUser(SignUpRequest request);

        Task<User?> GetUserByRefreshToken(string refreshToken);

        Task AddNewUserAsync(User user);

        Task<User?> GetUserByIdAsync(int userId);
        Task<User?> GetUserByEmailAsync(string email);
        
    }

    public class AuthRepositories : IAuthRepositories
    {
        private readonly DatabaseContext _db;
        private readonly IMemoryCache _cache;

        public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await _db.Users.FindAsync(userId);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

        public AuthRepositories(DatabaseContext dbContext, IMemoryCache cache)
        {
            _db = dbContext;
            _cache = cache;
        }

        public async Task SaveTokenMemory(string token)
        {
            _cache.Set("token", token, TimeSpan.FromHours(8));
            await Task.CompletedTask;
        }

        public async Task ClearTokenMemory()
        {
            _cache.Remove("token");
            await Task.CompletedTask;
        }

        public async Task<User?> GetUserByUsernamec(string username, string role)
        {
            return await _db.Users.SingleOrDefaultAsync(u => u.Username == username && u.Role.ToLower() == role);
        }

        public async Task<User?> GetExistUser(SignUpRequest request)
        {
            return await _db.Users.SingleOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Email);
        }

        public async Task AddNewUserAsync(User user)
        {
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }

        public async Task<User?> GetUserByRefreshToken(string refreshToken)
        {
            return await _db.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }
    }
}
