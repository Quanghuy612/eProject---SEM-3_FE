using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using server.DTOs.JwtSettingsDTO;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Helpers
{
    public class TokenHelpers
    {
        private readonly JwtSettings _jwtSettings;
        private IMemoryCache _cache;

        public TokenHelpers(IOptions<JwtSettings> jwtSettings, IMemoryCache cache)
        {
            _jwtSettings = jwtSettings.Value;
            _cache = cache;
        }

        public string CreateAccessToken(int userId, string username, string fullName, string role, string phoneNumber, string email)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiry = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes);

            var claims = new[]
            {
                new Claim("UserId", userId.ToString()),
                new Claim("Username", username),
                new Claim("FullName", fullName),
                new Claim("PhoneNumber", phoneNumber),
                new Claim("Email", email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Exp, new DateTimeOffset(expiry).ToUnixTimeSeconds().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiry,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public (string Token, DateTime Expiry) CreateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            string refreshToken = Convert.ToBase64String(randomBytes);
            DateTime expiry = DateTime.UtcNow.AddHours(_jwtSettings.RefreshTokenExpirationHours);

            return (refreshToken, expiry);
        }

        public (string? Username, string? PhoneNumber) DecodeToken()
        {
            if (!_cache.TryGetValue("token", out string? token) || string.IsNullOrEmpty(token))
            {
                return (null, null);
            }

            var handler = new JwtSecurityTokenHandler();

            if (!handler.CanReadToken(token))
            {
                return (null, null);
            }

            var jwtToken = handler.ReadJwtToken(token);

            var username = jwtToken.Claims.FirstOrDefault(c => c.Type == "Username")?.Value;
            var phoneNumber = jwtToken.Claims.FirstOrDefault(c => c.Type == "PhoneNumber")?.Value;

            return (username, phoneNumber);
        }
    }
}
