
namespace server.Services
{
    public class RechargeServices
    {
        private IRechargeRepositories _rechargeRepositories;
        public RechargeServices(IRechargeRepositories rechargeRepositories)
        {
            _rechargeRepositories = rechargeRepositories;
        }

        public async Task<ApiResponse> GetOtpAsync(VertifyPhoneRequest request)
        {
            try
            {
                var otp = new Random().Next(100000, 999999).ToString();

                await _rechargeRepositories.SaveOtp(request.Phone, otp);

                var response = new
                {
                    Otp = otp
                };

                return ApiResponse.Success(response, "Get Otp successful");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during vertify: {ex.Message}");
            }
        }

        public async Task<ApiResponse> VeritifyOtpAsync(VertifyPhoneRequest request)
        {
            try
            {
                var otp = await _rechargeRepositories.VeritifyOtp(request.Phone, request.Otp);

                if (otp == null)
                {
                    return ApiResponse.Error(400, "Invalid OTP or phone number.");
                }

                return ApiResponse.Success(null, "Vertify successful");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during vertify otp: {ex.Message}");
            }
        }

        public async Task<ApiResponse> VertifyUserAsync(VertifyPhoneRequest request)
        {
            try
            {
                var user = await _rechargeRepositories.CheckUserPhone(request.Phone);

                if (user == null)
                {

                    return ApiResponse.Error(400, "User not found");

                }

                return ApiResponse.Success(null, "Vertify success");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during vertify: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetOnlineRechargeAsync()
        {
            try
            {
                var recharges = await _rechargeRepositories.GetTopUp();

                return ApiResponse.Success(recharges, "Get online recharge success");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during get online recharge: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetSpecialRechargeAsync()
        {
            try
            {
                var recharges = await _rechargeRepositories.GetSpecialRecharge();

                return ApiResponse.Success(recharges, "Get online recharge success");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred during get online recharge: {ex.Message}");
            }
        }
    }
}
