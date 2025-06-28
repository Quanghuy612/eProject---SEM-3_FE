using System.ComponentModel.DataAnnotations;

namespace server.DTOs.FeedbackMessageDTO
{
    public class CreateFeedbackMessage
    {
        [Required(ErrorMessage = "Feedback ID is required.")]
        public int FeedbackId { get; set; }
        [Required(ErrorMessage = "Message content is required.")]
        [StringLength(1000, ErrorMessage = "Message content cannot exceed 1000 characters.")]
        public string Message { get; set; } = string.Empty;
    }
}
