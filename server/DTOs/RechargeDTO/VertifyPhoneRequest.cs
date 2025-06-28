namespace server.DTOs.RechargeDTO
{
    public class VertifyPhoneRequest
    {
        public required string Phone { get; set; }
        public string? Otp { get; set; }
    }
}
