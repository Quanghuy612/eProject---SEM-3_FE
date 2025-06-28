using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, MaxLength(50)]
        public required string Username { get; set; }

        [Required, MaxLength(10)]
        public required string PhoneNumber { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string Fullname { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Role { get; set; } = "User";

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiredTime { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
