using System.ComponentModel.DataAnnotations;

namespace server.DTOs.FeedbackDTO
{
    public class CreateFeedback
    {
        public int? UserId { get; set; }

        [Required(ErrorMessage = "Subject is required.")]
        [StringLength(200, ErrorMessage = "Subject cannot exceed 200 characters.")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Initial message is required.")]
        [StringLength(2000, ErrorMessage = "Initial message cannot exceed 2000 characters.")]
        public string InitialMessage { get; set; } = string.Empty;
        public string Status { get; set; } = "Open";

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Ratting { get; set; }
    }
}
