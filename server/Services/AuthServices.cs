
namespace server.Services
{
    public class AuthServices
    {
        private IAuthRepositories _authRepositories;
        private IUserRepositories _userRepositories;
        private TokenHelpers _tokenHelpers;

        public AuthServices(IAuthRepositories authRepositories, TokenHelpers tokenHelpers, IUserRepositories userRepositories)
        {
            _authRepositories = authRepositories;
            _tokenHelpers = tokenHelpers;
            _userRepositories = userRepositories;
        }

        public async Task<ApiResponse> LoginAsync(LoginRequest request, string role)
        {
            try
            {
                var user = await _authRepositories.GetUserByUsernamec(request.Username, role);

                if (user == null || !PasswordHelper.VerifyPassword(request.Password, user.Password))
                {
                    return ApiResponse.Error(401, "Invalid username or password");
                }

                var accessToken = _tokenHelpers.CreateAccessToken(user.UserId, user.Username, user.Fullname, user.Role, user.PhoneNumber, user.Email);
                var refreshToken = _tokenHelpers.CreateRefreshToken();

                user.RefreshToken = refreshToken.Token;
                user.RefreshTokenExpiredTime = refreshToken.Expiry;

                await _userRepositories.UpdateUserAsync(user);

                await _authRepositories.SaveTokenMemory(accessToken);

                var response = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken.Token
                };

                return ApiResponse.Success(response,"Login successfull");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during login: {ex.Message}");
            }
        }

        public async Task<ApiResponse> SignUpAsync(SignUpRequest request)
        {
            try
            {
                var existUser = await _authRepositories.GetExistUser(request);

                if(existUser != null) return ApiResponse.Error(400, "Username or email have already existed!");

                string hashedPassword = PasswordHelper.HashPassword(request.Password);

                var newUser = new User
                {
                    Username = request.Username,
                    PhoneNumber = request.PhoneNumber,
                    Email = request.Email,
                    Fullname = request.Fullname,
                    Password = hashedPassword,
                    Role = "User",
                    CreatedAt = DateTime.UtcNow,
                };

                await _authRepositories.AddNewUserAsync(newUser);

                return ApiResponse.Success(null, "Sign up successfull");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during sign up: {ex.Message}");
            }
        }

        public async Task<ApiResponse> LogOutAsync(string refreshToken)
        {
            try
            {
                var user = await _authRepositories.GetUserByRefreshToken(refreshToken);

                if (user == null) return ApiResponse.Success(null, "User already logged out or token invalid");

                user.RefreshToken = null;
                user.RefreshTokenExpiredTime = DateTime.MinValue;

                await _userRepositories.UpdateUserAsync(user);

                await _authRepositories.ClearTokenMemory();

                return ApiResponse.Success(null, "Logged out successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during log out: {ex.Message}");
            }
        }

        public async Task<ApiResponse> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                var user = await _authRepositories.GetUserByRefreshToken(refreshToken);

                if (user == null || user.RefreshTokenExpiredTime <= DateTime.UtcNow) return ApiResponse.Error(401, "Invalid or expired refresh token");

                var newAccessToken = _tokenHelpers.CreateAccessToken(user.UserId, user.Username, user.Fullname, user.Role, user.PhoneNumber, user.Email);
                var newRefreshToken = _tokenHelpers.CreateRefreshToken();

                user.RefreshToken = newRefreshToken.Token;
                user.RefreshTokenExpiredTime = newRefreshToken.Expiry;

                await _userRepositories.UpdateUserAsync(user);

                await _authRepositories.SaveTokenMemory(newAccessToken);

                var response = new LoginResponse
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken.Token
                };

                return ApiResponse.Success(response, "Token refreshed successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during refresh token: {ex.Message}");
            }
        }
    }
}
