namespace server.DTOs.ApiResponseDTO
{
    public class ApiResponse
    {
        public int StatusCode { get; set; }
        public object? Data { get; set; }
        public string? Message { get; set; }
        public static ApiResponse Success(object? data, string? message = null)
            => new() { StatusCode = 200, Data = data, Message = message };
        public static ApiResponse Error(int statusCode, string message)
            => new() { StatusCode = statusCode, Data = null, Message = message };
    }
}
