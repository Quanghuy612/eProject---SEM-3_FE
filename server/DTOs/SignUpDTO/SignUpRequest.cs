using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace server.DTOs.LoginDTO
{
    public class SignUpRequest
    {
        public required string Username { get; set; }
        public required string Fullname { get; set; }
        public required string Password { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Email { get; set; }
    }
}
