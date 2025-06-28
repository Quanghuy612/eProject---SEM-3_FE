
namespace server.Services
{
    public class AdminServices
    {
        private IAuthRepositories _authRepositories;
        private IUserRepositories _userRepositories;
        private TokenHelpers _tokenHelpers;
        private readonly DatabaseContext _db;

        public AdminServices(IAuthRepositories authRepositories, TokenHelpers tokenHelpers, IUserRepositories userRepositories, DatabaseContext db)
        {
            _authRepositories = authRepositories;
            _tokenHelpers = tokenHelpers;
            _userRepositories = userRepositories;
            _db = db;
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

        public async Task<ApiResponse> CaculateTotalAsync()
        {
            try
            {
                var today = DateTime.Today;
                var tomorrow = today.AddDays(1);

                var newUsers = await _db.Users.Where(u => u.Role == "User" && u.CreatedAt >= today && u.CreatedAt < tomorrow).CountAsync();

                var feedbacks = await _db.Feedbacks.Where(f => f.CreatedAt >= today && f.CreatedAt < tomorrow).CountAsync();

                var transactionsToday = await _db.Transactions.Where(t => t.TransactionDate >= today && t.TransactionDate < tomorrow).ToListAsync();

                var transactionCount = transactionsToday.Count;
                var totalRevenue = await _db.Transactions.SumAsync(t => t.TotalAmount);

                var response = new
                {
                    NewUsers = newUsers,
                    Feedbacks = feedbacks,
                    TransactionCount = transactionCount,
                    TotalRevenue = totalRevenue
                };

                return ApiResponse.Success(response, "Get totals successfull");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred: {ex.Message}");
            }
        }

        private async Task<List<DailyUsageDto>> GetTopUpUsageByDayAsync(DateTime start, DateTime end)
        {
            var data = await _db.Bills
                .Where(b => b.CreatedDate >= start && b.CreatedDate < end && b.TopUpId != null)
                .GroupBy(b => b.CreatedDate.Date)
                .Select(g => new DailyUsageDto { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            return FillMissingDays(data, start);
        }

        private async Task<List<DailyUsageDto>> GetSpecialRechargeUsageByDayAsync(DateTime start, DateTime end)
        {
            var data = await _db.BillSpecialRechargePackages
                .Where(x => x.Bill.CreatedDate >= start && x.Bill.CreatedDate < end)
                .GroupBy(x => x.Bill.CreatedDate.Date)
                .Select(g => new DailyUsageDto { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            return FillMissingDays(data, start);
        }

        private async Task<List<DailyUsageDto>> GetSpecialServiceUsageByDayAsync(DateTime start, DateTime end)
        {
            var data = await _db.BillSpecialServicePackages
                .Where(x => x.Bill.CreatedDate >= start && x.Bill.CreatedDate < end)
                .GroupBy(x => x.Bill.CreatedDate.Date)
                .Select(g => new DailyUsageDto { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            return FillMissingDays(data, start);
        }

        private List<DailyUsageDto> FillMissingDays(List<DailyUsageDto> data, DateTime startOfWeek)
        {
            return Enumerable.Range(0, 7)
                .Select(i => startOfWeek.AddDays(i))
                .Select(date => new DailyUsageDto
                {
                    Date = date,
                    Count = data.FirstOrDefault(d => d.Date == date)?.Count ?? 0
                })
                .ToList();
        }

        public async Task<ApiResponse> CaculateServicesAsync()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
                var endOfWeek = startOfWeek.AddDays(7);

                var topUps = await GetTopUpUsageByDayAsync(startOfWeek, endOfWeek);
                var specialRecharges = await GetSpecialRechargeUsageByDayAsync(startOfWeek, endOfWeek);
                var specialServices = await GetSpecialServiceUsageByDayAsync(startOfWeek, endOfWeek);

                var result = Enumerable.Range(0, 7)
                    .Select(i => startOfWeek.AddDays(i))
                    .Select(date => new
                    {
                        Date = date.ToString("dd/MM/yyyy"),
                        TotalTopUp = topUps.FirstOrDefault(x => x.Date == date)?.Count ?? 0,
                        TotalSpecialRecharge = specialRecharges.FirstOrDefault(x => x.Date == date)?.Count ?? 0,
                        TotalSpecialService = specialServices.FirstOrDefault(x => x.Date == date)?.Count ?? 0
                    })
                    .ToList();

                return ApiResponse.Success(result, "Service usage stats retrieved successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetBillsAsync(DateTime? fromDate, DateTime? toDate, bool? isPaid)
        {
            try
            {
                var query =
                    from bill in _db.Bills
                    join topup in _db.TopUpPackages
                        on bill.TopUpId equals topup.TopUpId into topupJoin
                    from topup in topupJoin.DefaultIfEmpty()
                    select new
                    {
                        bill.BillId,
                        bill.PhoneNumber,
                        bill.TotalAmount,
                        bill.DueDate,
                        bill.IsPaid,
                        bill.CreatedDate,

                        PackageName =
                            topup != null ? topup.TopUpName :
                            bill.BillSpecialRechargePackages
                                .Select(rp => rp.SpecialRechargePackage.SpecialRechargeName)
                                .FirstOrDefault() ??
                            bill.BillSpecialServicePackages
                                .Select(sp => sp.SpecialServicePackage.SpecialServiceName)
                                .FirstOrDefault(),

                        PackageType =
                            topup != null ? "Top Up" :
                            bill.BillSpecialRechargePackages.Any() ? "Special Recharge" :
                            bill.BillSpecialServicePackages.Any() ? "Special Service" :
                            null
                    };

                if (fromDate.HasValue)
                {
                    query = query.Where(b => b.CreatedDate.Date >= fromDate.Value.Date);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(b => b.CreatedDate.Date <= toDate.Value.Date);
                }

                if (isPaid.HasValue)
                {
                    query = query.Where(b => b.IsPaid == isPaid.Value);
                }

                var result = await query.ToListAsync();

                return ApiResponse.Success(result, "Get bills with package names successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetTransactionsAsync(DateTime? fromDate, DateTime? toDate)
        {
            try
            {
                var query = _db.Transactions.AsQueryable();

                if (fromDate.HasValue)
                {
                    query = query.Where(t => t.TransactionDate.Date >= fromDate.Value.Date);
                }

                if (toDate.HasValue)
                {
                    query = query.Where(t => t.TransactionDate.Date <= toDate.Value.Date);
                }

                var result = await query.ToListAsync();

                return ApiResponse.Success(result, "Get transactions successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetPackagesAsync()
        {
            try
            {
                // Top-up usage
                var topup = _db.TopUpPackages
                    .GroupJoin(
                        _db.Bills,
                        topup => topup.TopUpId,
                        bill => bill.TopUpId,
                        (topup, bills) => new
                        {
                            id = topup.TopUpId,
                            name = topup.TopUpName,
                            count = bills.Count(),
                            type="topup",
                            enable = topup.IsEnabled
                        }
                    )
                    .OrderByDescending(x => x.count)
                    .ToList();


                // Special Recharge usage
                var specialRecharge = _db.SpecialRechargePackages
                    .GroupJoin(
                        _db.BillSpecialRechargePackages,
                        recharge => recharge.SpecialRechargeId,
                        bill => bill.SpecialRechargeId,
                        (recharge, bills) => new
                        {
                            id = recharge.SpecialRechargeId,
                            name = recharge.SpecialRechargeName,
                            count = bills.Count(),
                            type = "specialrecharge",
                            enable = recharge.IsEnabled
                        }
                    )
                    .OrderByDescending(x => x.count)
                    .ToList();


                // Special Service usage
                var specialServices = _db.SpecialServicePackages
                    .GroupJoin(
                        _db.BillSpecialServicePackages,
                        service => service.SpecialServiceId,
                        bill => bill.SpecialServiceId,
                        (service, bills) => new
                        {
                            id = service.SpecialServiceId,
                            name = service.SpecialServiceName,
                            count = bills.Count(),
                            type = "specialservice",
                            enable = service.IsEnabled
                        }
                    )
                    .OrderByDescending(x => x.count)
                    .ToList();

                // Combine into one object
                var result = new
                {
                    topup,
                    specialRecharge,
                    specialServices
                };

                return ApiResponse.Success(result, "Get packages successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetUsersAsync()
        {
            try
            {
                var result = await _db.Users
                     .Where(u => u.Role != "Admin")
                     .Select(u => new
                     {
                         u.Username,
                         u.Fullname,
                         u.Email,
                         u.PhoneNumber
                     })
                     .ToListAsync();

                return ApiResponse.Success(result, "Get users successfully");

            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetFeedbacksAsync()
        {
            try
            {
                var result = await (from feedback in _db.Feedbacks
                                    join user in _db.Users
                                        on feedback.UserId equals user.UserId into userGroup
                                    from user in userGroup.DefaultIfEmpty()
                                    select new
                                    {
                                        feedback.FeedbackId,
                                        feedback.UserId,
                                        Username = user != null ? user.Username : "Guest",
                                        feedback.Subject,
                                        feedback.InitialMessage,
                                        feedback.Status,
                                        feedback.Ratting,
                                        feedback.CreatedAt
                                    }).ToListAsync();

                return ApiResponse.Success(result, "Get feedbacks successfully");

            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse> ApproveFeedbackAsync(int feedbackId)
        {
            var feedback = await _db.Feedbacks.FindAsync(feedbackId);
            if (feedback == null)
                return ApiResponse.Error(400, "Feedback not found");

            feedback.Status = "Approved";
            _db.Feedbacks.Update(feedback);
            await _db.SaveChangesAsync();

            return ApiResponse.Success(null, "Feedback approved successfully");
        }

        public async Task<ApiResponse> CloseFeedbackAsync(int feedbackId)
        {
            var feedback = await _db.Feedbacks.FindAsync(feedbackId);
            if (feedback == null)
                return ApiResponse.Error(400, "Feedback not found");

            feedback.Status = "Closed";
            _db.Feedbacks.Update(feedback);
            await _db.SaveChangesAsync();

            return ApiResponse.Success(null, "Feedback closed successfully");
        }

        public async Task<ApiResponse> TogglePackageAsync(int packageId, string type, string actionType)
        {
            try
            {
                bool enable;
                if (actionType.Equals("enable", StringComparison.OrdinalIgnoreCase))
                    enable = true;
                else if (actionType.Equals("disable", StringComparison.OrdinalIgnoreCase))
                    enable = false;
                else
                    return ApiResponse.Error(400, "Invalid action type");

                type = type?.ToLower();

                switch (type)
                {
                    case "topup":
                        var topupPackage = await _db.TopUpPackages.FindAsync(packageId);
                        if (topupPackage == null) return ApiResponse.Error(400, "Top-up package not found");
                        topupPackage.IsEnabled = enable;
                        _db.TopUpPackages.Update(topupPackage);
                        break;

                    case "specialrecharge":
                        var specialRechargePackage = await _db.SpecialRechargePackages.FindAsync(packageId);
                        if (specialRechargePackage == null) return ApiResponse.Error(400, "Special recharge package not found");
                        specialRechargePackage.IsEnabled = enable;
                        _db.SpecialRechargePackages.Update(specialRechargePackage);
                        break;

                    case "specialservice":
                        var specialServicePackage = await _db.SpecialServicePackages.FindAsync(packageId);
                        if (specialServicePackage == null) return ApiResponse.Error(400, "Special service package not found");
                        specialServicePackage.IsEnabled = enable;
                        _db.SpecialServicePackages.Update(specialServicePackage);
                        break;

                    default:
                        return ApiResponse.Error(400, "Invalid package type");
                }

                await _db.SaveChangesAsync();

                return ApiResponse.Success(null, $"Package {(enable ? "enabled" : "disabled")} successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"Error toggling package: {ex.Message}");
            }
        }

        public async Task<ApiResponse> AddPackageAsync(CreateSpecialSvcPackgeDto request)
        {
            try
            {
                switch (request.type.ToLower())
                {
                    case "topup":
                        var topup = new TopUpPackage
                        {
                            TopUpName = request.name,
                            Price = request.amount,
                            IsEnabled = false
                        };
                        _db.TopUpPackages.Add(topup);
                        break;

                    case "specialrecharge":
                        var recharge = new SpecialRechargePackage
                        {
                            SpecialRechargeName = request.name,
                            Price = request.amount,
                            IsEnabled = false
                        };
                        _db.SpecialRechargePackages.Add(recharge);
                        break;

                    case "specialservice":
                        var service = new SpecialServicePackage
                        {
                            SpecialServiceName = request.name,
                            Price = request.amount,
                            IsEnabled = false
                        };
                        _db.SpecialServicePackages.Add(service);
                        break;

                    default:
                        return ApiResponse.Error(400, "Invalid package type");
                }

                await _db.SaveChangesAsync();
                return ApiResponse.Success(null, "Package added successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"Error adding package: {ex.Message}");
            }
        }

    }
}
