using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class FeedbackMessage
    {
        [Key]
        public int MessageId { get; set; }

        public int FeedbackId { get; set; }

        public int SenderId { get; set; }

        public bool IsAgent { get; set; }

        public string Message { get; set; } = string.Empty;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public Feedback? Feedback { get; set; }
    }
}
