using Microsoft.EntityFrameworkCore;
using server.Database;
using server.Models;

namespace server.Services
{
    public class SpecialServicePackageService
    {
        private readonly DatabaseContext _dbContext;

        public SpecialServicePackageService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResponse> GetAllAsync()
        {
            try
            {
                var services = await _dbContext.SpecialServicePackages
                    .Where(s => s.IsEnabled)
                    .ToListAsync();

                if (!services.Any())
                {
                    var defaultServices = new List<SpecialServicePackage>
                {
                    new SpecialServicePackage { SpecialServiceName = "Do Not Disturb (DND)", Price = 0, IsEnabled = true },
                    new SpecialServicePackage { SpecialServiceName = "Caller Tunes", Price = 10, IsEnabled = true },
                    new SpecialServicePackage { SpecialServiceName = "Missed Call Alerts", Price = 5, IsEnabled = true },
                    new SpecialServicePackage { SpecialServiceName = "International Roaming", Price = 50, IsEnabled = true },
                    new SpecialServicePackage { SpecialServiceName = "Voice Mail", Price = 5, IsEnabled = true },
                    new SpecialServicePackage { SpecialServiceName = "Call Forwarding", Price = 2, IsEnabled = true },
                    new SpecialServicePackage { SpecialServiceName = "Family & Friends Plan", Price = 15, IsEnabled = true }
                };

                    _dbContext.SpecialServicePackages.AddRange(defaultServices);
                    await _dbContext.SaveChangesAsync();

                    services = defaultServices;
                }

                return ApiResponse.Success(services, "Get list services successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse.Error(500, $"Get list services failed: {ex.Message}");
            }
        }

        public async Task<SpecialServicePackage> CreateAsync(SpecialServicePackage package)
        {
            _dbContext.SpecialServicePackages.Add(package);
            await _dbContext.SaveChangesAsync();
            return package;
        }
    }
}
