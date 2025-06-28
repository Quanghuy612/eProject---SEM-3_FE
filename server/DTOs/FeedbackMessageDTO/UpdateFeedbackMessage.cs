using System.ComponentModel.DataAnnotations;

namespace server.DTOs.FeedbackMessageDTO
{
    public class UpdateFeedbackMessage
    {
        [Required(ErrorMessage = "Message content is required for update.")]
        [StringLength(1000, ErrorMessage = "Message content cannot exceed 1000 characters.")]
        public string Message { get; set; } = string.Empty;
    }
}
