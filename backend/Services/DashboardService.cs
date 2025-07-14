using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;

namespace backend.Services
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
        Task<List<InvoiceDto>> GetRecentInvoicesAsync(int count = 5);
    }

    public class DashboardService : IDashboardService
    {
        private readonly BillingContext _context;

        public DashboardService(BillingContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalCustomers = await _context.Customers.CountAsync();
            
            var totalRevenue = await _context.Invoices
                .Where(i => i.Status == InvoiceStatus.Paid)
                .SumAsync(i => i.Total);

            var pendingInvoices = await _context.Invoices
                .CountAsync(i => i.Status == InvoiceStatus.Sent);

            var overdueInvoices = await _context.Invoices
                .CountAsync(i => i.Status == InvoiceStatus.Overdue || 
                                (i.Status == InvoiceStatus.Sent && i.DueDate < DateTime.Today));

            var pendingAmount = await _context.Invoices
                .Where(i => i.Status == InvoiceStatus.Sent)
                .SumAsync(i => i.Total);

            var overdueAmount = await _context.Invoices
                .Where(i => i.Status == InvoiceStatus.Overdue || 
                           (i.Status == InvoiceStatus.Sent && i.DueDate < DateTime.Today))
                .SumAsync(i => i.Total);

            return new DashboardStatsDto
            {
                TotalRevenue = totalRevenue,
                PendingInvoices = pendingInvoices,
                TotalCustomers = totalCustomers,
                OverdueInvoices = overdueInvoices,
                PendingAmount = pendingAmount,
                OverdueAmount = overdueAmount
            };
        }

        public async Task<List<InvoiceDto>> GetRecentInvoicesAsync(int count = 5)
        {
            var invoices = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .OrderByDescending(i => i.Date)
                .Take(count)
                .ToListAsync();

            return invoices.Select(i => new InvoiceDto
            {
                Id = i.Id,
                InvoiceNumber = i.InvoiceNumber,
                Date = i.Date,
                DueDate = i.DueDate,
                Customer = new CustomerDto
                {
                    Id = i.Customer.Id,
                    Name = i.Customer.Name,
                    Email = i.Customer.Email,
                    Phone = i.Customer.Phone,
                    Address = i.Customer.Address
                },
                SubTotal = i.SubTotal,
                TaxAmount = i.TaxAmount,
                Total = i.Total,
                Status = i.Status.ToString(),
                Items = i.Items.Select(item => new InvoiceItemDto
                {
                    Id = item.Id,
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Total = item.Total
                }).ToList(),
                Notes = i.Notes
            }).ToList();
        }
    }
}
