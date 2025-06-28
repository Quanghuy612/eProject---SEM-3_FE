using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Security.Claims;
using System;

public class TransactionService
{
    private readonly DatabaseContext _dbContext;

    public TransactionService(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ApiResponse> PayBillsAsync(PayBillsRequestDto request, string phoneNumber)
    {
        using var dbTransaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            if (request.BillIds == null || !request.BillIds.Any())
                return ApiResponse.Error(400, "No bill IDs provided");

            var bills = await _dbContext.Bills
                .Where(b => request.BillIds.Contains(b.BillId) && !b.IsPaid)
                .ToListAsync();

            if (!bills.Any())
                return ApiResponse.Error(404, "No unpaid bills found for provided IDs");

            if (string.IsNullOrWhiteSpace(phoneNumber))
                return ApiResponse.Error(400, "Phone number is missing");

            if (string.IsNullOrWhiteSpace(request.PaymentMethod))
                return ApiResponse.Error(400, "Payment method is missing");

            var totalAmount = bills.Sum(b => b.TotalAmount);
            if (totalAmount <= 0)
                return ApiResponse.Error(400, "Total amount must be greater than zero");

            var transaction = new Transaction
            {
                PhoneNumber = phoneNumber,
                TransactionDate = DateTime.UtcNow,
                TotalAmount = bills.Sum(b => b.TotalAmount),
                PaymentMethod = request.PaymentMethod,
                PaymentDate = DateTime.UtcNow,
            };

            _dbContext.Transactions.Add(transaction);
            await _dbContext.SaveChangesAsync();

            foreach (var bill in bills)
            {
                bill.IsPaid = true;
                bill.TransactionId = transaction.TransactionId;
            }

            await _dbContext.SaveChangesAsync();
            await dbTransaction.CommitAsync();

            var response = new PayBillsResponseDto
            {
                TransactionId = transaction.TransactionId,
                PaidBillIds = bills.Select(b => b.BillId).ToList(),
                TotalAmount = transaction.TotalAmount,
                PaymentMethod = transaction.PaymentMethod,
                PhoneNumber = transaction.PhoneNumber,
                TransactionDateTime = transaction.TransactionDate.ToString("dd/MM/yyyy - HH:mm")
            };

            return ApiResponse.Success(response, "Bills paid successfully");
        }
        catch (Exception ex)
        {
            await dbTransaction.RollbackAsync();
            return ApiResponse.Error(500, $"Internal server error: {ex.Message}");
        }
    }

    public async Task<ApiResponse> GetTransactionsByPhoneNumberAsync(
        string phoneNumber,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int currentPage = 1
    )
    {
        const int pageSize = 10;
        int page = currentPage > 0 ? currentPage : 1;

        IQueryable<Transaction> query = _dbContext.Transactions
            .Where(t => t.PhoneNumber == phoneNumber)
            .Include(t => t.Bills);

        if (fromDate.HasValue)
        {
            query = query.Where(t => t.TransactionDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(t => t.TransactionDate <= toDate.Value);
        }

        int totalItems = await query.CountAsync();

        query = query.OrderByDescending(t => t.TransactionDate);

        var transactions = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var data = transactions.Select(t => new
        {
            t.TransactionId,
            t.PhoneNumber,
            t.TotalAmount,
            LocalTime = t.TransactionDate.ToLocalTime().ToString("dd/MM/yyyy - HH:mm"),
            t.PaymentMethod,
            Bills = t.Bills.Select(b => new { b.BillId, b.TotalAmount, b.IsPaid })
        });

        return ApiResponse.Success(new
        {
            data,
            totalItems
        });
    }

    public async Task<ApiResponse> PayBillsAsync(List<int> billIds)
    {
        try
        {
            var bills = await _dbContext.Bills
                .Where(b => billIds.Contains(b.BillId) && !b.IsPaid)
                .ToListAsync();

            if (!bills.Any())
                return ApiResponse.Error(404, "No unpaid bills found for the provided IDs");

            var phoneNumber = bills.First().PhoneNumber;

            var transaction = new Transaction
            {
                PhoneNumber = phoneNumber,
                TransactionDate = DateTime.UtcNow,
                TotalAmount = bills.Sum(b => b.TotalAmount),
                PaymentMethod = "Default"
            };

            _dbContext.Transactions.Add(transaction);
            await _dbContext.SaveChangesAsync();

            foreach (var bill in bills)
            {
                bill.IsPaid = true;
                bill.TransactionId = transaction.TransactionId;
            }

            await _dbContext.SaveChangesAsync();

            return ApiResponse.Success(new
            {
                TransactionId = transaction.TransactionId,
                PaidBillIds = bills.Select(b => b.BillId).ToList()
            }, "Bills paid successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse.Error(500, $"An error occurred while processing payment: {ex.Message}");
        }
    }
}
