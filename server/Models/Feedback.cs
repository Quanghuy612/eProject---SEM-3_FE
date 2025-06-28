using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }

        public int? UserId { get; set; }

        public string Subject { get; set; } = string.Empty;

        public string InitialMessage { get; set; } = string.Empty;

        public string Status { get; set; } = "Open";

        public int Ratting { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<FeedbackMessage> Messages { get; set; } = new();
    }
}
