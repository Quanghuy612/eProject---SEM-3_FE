using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class VertifyPhoneData
    {
        [Key]
        public int VertifyId { get; set; }

        [Required, MaxLength(10)]
        public required string PhoneNumber { get; set; }

        [Required, MaxLength(6)]
        public string Otp { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddMinutes(5);

        public bool IsUsed { get; set; } = false;
    }
}
