namespace server.DTOs.UserDTO
{
    public class UserResponseDto
    {
        public int UserId { get; set; } 
        public string Username { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Fullname { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
    
    public class UserUpdateDto
{
    public int UserId { get; set; } 
    public string PhoneNumber { get; set; } = string.Empty;
    public string Fullname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string CurrentPassword { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
}