using server.DTOs.FeedbackMessageDTO;

namespace server.DTOs.FeedbackDTO
   
{
    public class FeedbackResponse
    {
        public int FeedbackId { get; set; }
        public int? UserId { get; set; } 
        public string Subject { get; set; } = string.Empty;
        public string InitialMessage { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int Ratting { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<FeedbackMessageResponse> Messages { get; set; } = new(); 
    }
}
