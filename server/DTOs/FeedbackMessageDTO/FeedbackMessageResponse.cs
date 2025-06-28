namespace server.DTOs.FeedbackMessageDTO
{
    public class FeedbackMessageResponse
    {
        public int MessageId { get; set; }
        public int FeedbackId { get; set; }
        public int SenderId { get; set; }
        public bool IsAgent { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
