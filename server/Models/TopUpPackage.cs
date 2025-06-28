using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class TopUpPackage
    {
        [Key]
        public int TopUpId { get; set; }

        [Required]
        public required string TopUpName { get; set; }

        public decimal Price { get; set; }
        public bool IsEnabled { get; set; } = false;
    }
}
