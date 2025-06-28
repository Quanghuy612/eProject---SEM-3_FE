using Microsoft.EntityFrameworkCore;
using server.DTOs.ApiResponseDTO;
using server.DTOs.BillDTO;
using server.Models;
using System.Security.Claims;

namespace server.Services
{
    public class BillService
    {
        private readonly DatabaseContext _context;

        public BillService(DatabaseContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse> GuestPayBill(CreateBillDto dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var bill = new Bill
                {
                    PhoneNumber = dto.PhoneNumber,
                    TotalAmount = dto.TotalAmount,
                    DueDate = DateTime.UtcNow.AddDays(30),
                    TopUpId = dto.TopUpId,
                    TransactionId = null,
                    IsPaid = false
                };

                _context.Bills.Add(bill);
                await _context.SaveChangesAsync();

                var transactionRecord = new Transaction
                {
                    PhoneNumber = dto.PhoneNumber,
                    TransactionDate = DateTime.UtcNow,
                    TotalAmount = bill.TotalAmount,
                    PaymentMethod = dto.PayMentMethod
                };

                _context.Transactions.Add(transactionRecord);
                await _context.SaveChangesAsync();

                bill.IsPaid = true;
                bill.TransactionId = transactionRecord.TransactionId;

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                var localTime = transactionRecord.TransactionDate.ToLocalTime();
                var transactionDto = new TransactionDto
                {
                    TransactionId = transactionRecord.TransactionId,
                    PhoneNumber = transactionRecord.PhoneNumber,
                    TransactionDate = localTime.ToString("dd/MM/yyyy HH:mm"),
                    TotalAmount = transactionRecord.TotalAmount,
                    PaymentMethod = transactionRecord.PaymentMethod
                };

                return ApiResponse.Success(transactionDto, "Bill created successfully");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ApiResponse.Error(500, $"Transaction failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse> CreateBillAsync(CreateBillDto dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (dto.PayMentMethod == "postpaying")
                {

                    var bill = new Bill
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TotalAmount = dto.TotalAmount,
                        DueDate = DateTime.UtcNow.AddDays(30),
                        TopUpId = dto.TopUpId,
                        TransactionId = null,
                        IsPaid = false
                    };

                    _context.Bills.Add(bill);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var responseDto = MapToResponseDto(bill);
                    return ApiResponse.Success(responseDto, "Bill created successfully");
                }
                else
                {
                    var bill = new Bill
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TotalAmount = dto.TotalAmount,
                        DueDate = DateTime.UtcNow.AddDays(30),
                        TopUpId = dto.TopUpId,
                        TransactionId = null,
                        IsPaid = false
                    };

                    _context.Bills.Add(bill);
                    await _context.SaveChangesAsync();

                    var transactionRecord = new Transaction
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TransactionDate = DateTime.UtcNow,
                        TotalAmount = bill.TotalAmount,
                        PaymentMethod = dto.PayMentMethod
                    };

                    _context.Transactions.Add(transactionRecord);
                    await _context.SaveChangesAsync();

                    bill.IsPaid = true;
                    bill.TransactionId = transactionRecord.TransactionId;

                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var localTime = transactionRecord.TransactionDate.ToLocalTime();
                    var transactionDto = new TransactionDto
                    {
                        TransactionId = transactionRecord.TransactionId,
                        PhoneNumber = transactionRecord.PhoneNumber,
                        TransactionDate = localTime.ToString("dd/MM/yyyy HH:mm"),
                        TotalAmount = transactionRecord.TotalAmount,
                        PaymentMethod = transactionRecord.PaymentMethod
                    };

                    return ApiResponse.Success(transactionDto, "Bill created successfully");
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ApiResponse.Error(500, $"Transaction failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse> GetBillByIdAsync(int id)
        {
            var bill = await _context.Bills.FindAsync(id);

            if (bill == null)
                return ApiResponse.Error(404, "Bill not found");

            var responseDto = MapToResponseDto(bill);
            return ApiResponse.Success(responseDto);
        }

        public async Task<ApiResponse> GetAllBillsAsync()
        {
            var bills = await _context.Bills.ToListAsync();

            var response = bills.Select(MapToResponseDto);
            return ApiResponse.Success(response);
        }

        public async Task<ApiResponse> UpdateBillAsync(int id, UpdateBillDto dto, ClaimsPrincipal user)
        {
            var bill = await _context.Bills.FindAsync(id);

            if (bill == null)
                return ApiResponse.Error(404, "Bill not found");

            bill.PhoneNumber = dto.PhoneNumber;
            bill.TotalAmount = dto.TotalAmount;
            bill.DueDate = dto.DueDate;
            bill.IsPaid = dto.IsPaid;
            bill.TopUpId = dto.TopUpId;
            bill.TransactionId = dto.TransactionId;

            await _context.SaveChangesAsync();

            var responseDto = MapToResponseDto(bill);
            return ApiResponse.Success(responseDto, "Bill updated successfully");
        }

        public async Task<ApiResponse> DeleteBillAsync(int id, ClaimsPrincipal user)
        {
            var bill = await _context.Bills.FindAsync(id);

            if (bill == null)
                return ApiResponse.Error(404, "Bill not found");

            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();

            return ApiResponse.Success(null, "Bill deleted successfully");
        }

        private BillResponseDto MapToResponseDto(Bill bill)
        {
            return new BillResponseDto
            {
                BillId = bill.BillId,
                PhoneNumber = bill.PhoneNumber,
                TotalAmount = bill.TotalAmount,
                DueDate = bill.DueDate,
                IsPaid = bill.IsPaid,
                TopUpId = bill.TopUpId,
            };
        }

        public async Task<ApiResponse> GetBillsByPhoneNumberAsync(
            string phoneNumber,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            bool? isPaid = null,
            int currentPage = 1,
            int pageSize = 10
        )
        {
            var query = from bill in _context.Bills
            where bill.PhoneNumber == phoneNumber
            join topup in _context.TopUpPackages
                on bill.TopUpId equals topup.TopUpId into topupJoin
            from topup in topupJoin.DefaultIfEmpty()
            select new
            {
                bill.BillId,
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

                // Apply filtering:
                if (fromDate.HasValue)
                    query = query.Where(b => b.DueDate >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(b => b.DueDate <= toDate.Value);

                if (isPaid.HasValue)
                    query = query.Where(b => b.IsPaid == isPaid.Value);

                // Apply paging
                var totalItems = await query.CountAsync();

                var pagedData = await query
                    .OrderByDescending(b => b.CreatedDate)
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = new
                {
                    TotalItems = totalItems,
                    CurrentPage = currentPage,
                    PageSize = pageSize,
                    Data = pagedData
                };


            return ApiResponse.Success(result, "Fetched bills with joined data successfully");
        }

        public async Task<ApiResponse> PayBillAsync(int billId, string phoneNumber, string paymentMethod)
        {
            var bill = await _context.Bills
                .FirstOrDefaultAsync(b => b.BillId == billId && b.PhoneNumber == phoneNumber);

            if (bill == null)
            {
                return ApiResponse.Error(404, "Bill not found");
            }

            if (bill.IsPaid)
            {
                return ApiResponse.Error(400, "Bill already paid");
            }

            var transaction = new Transaction
            {
                PhoneNumber = phoneNumber,
                TransactionDate = DateTime.UtcNow,
                TotalAmount = bill.TotalAmount,
                PaymentMethod = paymentMethod,
                PaymentDate = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            // Update bill
            bill.IsPaid = true;
            bill.TransactionId = transaction.TransactionId;

            await _context.SaveChangesAsync();

            return ApiResponse.Success(new
            {
                transaction.TransactionId,
                transaction.TransactionDate,
                transaction.TotalAmount,
                transaction.PaymentMethod,
                bill.BillId
            });
        }

        public async Task<ApiResponse> CreateSpecialRechargeBill(CreateBillDto dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (dto.PayMentMethod == "postpaying")
                {

                    var bill = new Bill
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TotalAmount = dto.TotalAmount,
                        DueDate = DateTime.UtcNow.AddDays(30),
                        TransactionId = null,
                        IsPaid = false
                    };

                    _context.Bills.Add(bill);
                    await _context.SaveChangesAsync();

                    var rechargeLink = new BillSpecialRechargePackage
                    {
                        BillId = bill.BillId,
                        SpecialRechargeId = dto.TopUpId
                    };

                    _context.Add(rechargeLink);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var responseDto = MapToResponseDto(bill);
                    return ApiResponse.Success(responseDto, "Bill created successfully");
                }
                else
                {
                    var bill = new Bill
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TotalAmount = dto.TotalAmount,
                        DueDate = DateTime.UtcNow.AddDays(30),
                        TransactionId = null,
                        IsPaid = false
                    };

                    _context.Bills.Add(bill);
                    await _context.SaveChangesAsync();

                    var rechargeLink = new BillSpecialRechargePackage
                    {
                        BillId = bill.BillId,
                        SpecialRechargeId = dto.TopUpId
                    };

                    _context.Add(rechargeLink);
                    await _context.SaveChangesAsync();

                    var transactionRecord = new Transaction
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TransactionDate = DateTime.UtcNow,
                        TotalAmount = bill.TotalAmount,
                        PaymentMethod = dto.PayMentMethod
                    };

                    _context.Transactions.Add(transactionRecord);
                    await _context.SaveChangesAsync();

                    bill.IsPaid = true;
                    bill.TransactionId = transactionRecord.TransactionId;

                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var localTime = transactionRecord.TransactionDate.ToLocalTime();
                    var transactionDto = new TransactionDto
                    {
                        TransactionId = transactionRecord.TransactionId,
                        PhoneNumber = transactionRecord.PhoneNumber,
                        TransactionDate = localTime.ToString("dd/MM/yyyy - HH:mm"),
                        TotalAmount = transactionRecord.TotalAmount,
                        PaymentMethod = transactionRecord.PaymentMethod
                    };

                    return ApiResponse.Success(transactionDto, "Bill created successfully");
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ApiResponse.Error(500, $"Transaction failed: {ex.Message}");
            }
        }

        public async Task<ApiResponse> CreateSpecialServiceBill(CreateBillDto dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (dto.PayMentMethod == "postpaying")
                {

                    var bill = new Bill
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TotalAmount = dto.TotalAmount,
                        DueDate = DateTime.UtcNow.AddDays(30),
                        TransactionId = null,
                        IsPaid = false
                    };

                    _context.Bills.Add(bill);
                    await _context.SaveChangesAsync();

                    var rechargeLink = new BillSpecialServicePackage
                    {
                        BillId = bill.BillId,
                        SpecialServiceId = dto.TopUpId
                    };

                    _context.Add(rechargeLink);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var responseDto = MapToResponseDto(bill);
                    return ApiResponse.Success(responseDto, "Bill created successfully");
                }
                else
                {
                    var bill = new Bill
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TotalAmount = dto.TotalAmount,
                        DueDate = DateTime.UtcNow.AddDays(30),
                        TransactionId = null,
                        IsPaid = false
                    };

                    _context.Bills.Add(bill);
                    await _context.SaveChangesAsync();

                    var rechargeLink = new BillSpecialServicePackage
                    {
                        BillId = bill.BillId,
                        SpecialServiceId = dto.TopUpId
                    };

                    _context.Add(rechargeLink);
                    await _context.SaveChangesAsync();

                    var transactionRecord = new Transaction
                    {
                        PhoneNumber = dto.PhoneNumber,
                        TransactionDate = DateTime.UtcNow,
                        TotalAmount = bill.TotalAmount,
                        PaymentMethod = dto.PayMentMethod
                    };

                    _context.Transactions.Add(transactionRecord);
                    await _context.SaveChangesAsync();

                    bill.IsPaid = true;
                    bill.TransactionId = transactionRecord.TransactionId;

                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    var localTime = transactionRecord.TransactionDate.ToLocalTime();
                    var transactionDto = new TransactionDto
                    {
                        TransactionId = transactionRecord.TransactionId,
                        PhoneNumber = transactionRecord.PhoneNumber,
                        TransactionDate = localTime.ToString("dd/MM/yyyy - HH:mm"),
                        TotalAmount = transactionRecord.TotalAmount,
                        PaymentMethod = transactionRecord.PaymentMethod
                    };

                    return ApiResponse.Success(transactionDto, "Bill created successfully");
                }
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ApiResponse.Error(500, $"Transaction failed: {ex.Message}");
            }
        }
    }
}
