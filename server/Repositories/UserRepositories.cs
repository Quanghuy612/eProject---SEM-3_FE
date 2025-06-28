using Microsoft.EntityFrameworkCore;
using server.Models;
using server.DTOs.UserDTO;
using System.Threading.Tasks;

namespace server.Repositories
{
    public class UserRepositories : IUserRepositories
    {
        private readonly DatabaseContext _db;

        public UserRepositories(DatabaseContext dbContext)
        {
            _db = dbContext;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _db.Users.FindAsync(id); 
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _db.Users
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<bool> UpdateUserAsync(int id, UserUpdateDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return false;

    
            user.PhoneNumber = dto.PhoneNumber;
            user.Fullname = dto.Fullname;
            user.Email = dto.Email;


            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
               
                if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                {
                    throw new ArgumentException("Current password is required to change password.");
                }

                
                bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password);
                if (!isCurrentPasswordValid)
                {
                    throw new ArgumentException("Current password is incorrect.");
                }

              
                user.Password = HashPassword(dto.Password);
            }

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task UpdateUserAsync(User user)
        {

            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }


        private string HashPassword(string password)
        {
       
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
