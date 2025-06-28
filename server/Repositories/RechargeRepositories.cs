
namespace server.Repositories
{
    public interface IRechargeRepositories
    {
        public Task SaveOtp(string phoneNumber, string otp);
        public Task<User?> CheckUserPhone(string phoneNumber);
        public Task<VertifyPhoneData?> VeritifyOtp(string phoneNumber, string otp);
        public Task<List<TopUpPackage>?> GetTopUp();
        public Task<List<SpecialRechargePackage>> GetSpecialRecharge();
    }

    public class RechargeRepositories : IRechargeRepositories
    {
        private readonly DatabaseContext _db;

        public RechargeRepositories(DatabaseContext database)
        {
            _db = database;
        }

        public async Task SaveOtp(string phoneNumber, string otp)
        {
            var existing = await _db.VertifyPhoneDatas.FirstOrDefaultAsync(x => x.PhoneNumber == phoneNumber);

            if (existing != null)
            {
                existing.Otp = otp;
                existing.CreatedAt = DateTime.UtcNow;
                existing.ExpiresAt = DateTime.UtcNow.AddMinutes(5);
                existing.IsUsed = false;
            }
            else
            {
                _db.VertifyPhoneDatas.Add(new VertifyPhoneData
                {
                    PhoneNumber = phoneNumber,
                    Otp = otp,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                    IsUsed = false
                });
            }

            await _db.SaveChangesAsync();
        }

        public async Task<VertifyPhoneData?> VeritifyOtp(string phoneNumber, string otp)
        {
            var savedOtp = await _db.VertifyPhoneDatas.FirstOrDefaultAsync(x => x.PhoneNumber == phoneNumber && x.Otp == otp);

            if (savedOtp == null) return null;

            if (savedOtp.CreatedAt.AddMinutes(5) < DateTime.UtcNow) return null;

            _db.VertifyPhoneDatas.Remove(savedOtp);

            await _db.SaveChangesAsync();

            return savedOtp;
        }

        public async Task<User?> CheckUserPhone(string phoneNumber)
        {
            return await _db.Users.FirstOrDefaultAsync(x => x.PhoneNumber == phoneNumber);
        }

        public async Task<List<TopUpPackage>> GetTopUp()
        {
            var topUps = await _db.TopUpPackages
                .Where(p => p.IsEnabled)
                .ToListAsync();

            if (!topUps.Any())
            {
                var defaultTopUps = new List<TopUpPackage>
                {
                    new TopUpPackage { TopUpName = "$20 Pack", Price = 20, IsEnabled = true },
                    new TopUpPackage { TopUpName = "$50 Pack", Price = 50, IsEnabled = true },
                    new TopUpPackage { TopUpName = "$100 Pack", Price = 100, IsEnabled = true },
                    new TopUpPackage { TopUpName = "$120 Pack", Price = 120, IsEnabled = true },
                    new TopUpPackage { TopUpName = "$150 Pack", Price = 150, IsEnabled = true },
                };

                _db.TopUpPackages.AddRange(defaultTopUps);
                await _db.SaveChangesAsync();

                topUps = defaultTopUps;
            }

            return topUps;
        }

        public async Task<List<SpecialRechargePackage>> GetSpecialRecharge()
        {
            var packages = await _db.SpecialRechargePackages
                .Where(p => p.IsEnabled)
                .ToListAsync();

            if (!await _db.SpecialRechargePackages.AnyAsync())
            {
                var defaultPackages = new List<SpecialRechargePackage>
                {
                    new SpecialRechargePackage { SpecialRechargeName = "$5 Pack", Price = 5, IsEnabled = true },
                    new SpecialRechargePackage { SpecialRechargeName = "$25 Pack", Price = 25, IsEnabled = true },
                    new SpecialRechargePackage { SpecialRechargeName = "$50 Pack", Price = 50, IsEnabled = true },
                };

                _db.SpecialRechargePackages.AddRange(defaultPackages);
                await _db.SaveChangesAsync();

                packages = defaultPackages;
            }

            return packages;
        }
    }
}
