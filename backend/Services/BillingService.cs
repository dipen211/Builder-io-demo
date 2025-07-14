using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Services
{
    public interface IBillingService
    {
        Task<List<Invoice>> GetInvoicesAsync();
        Task<Invoice?> GetInvoiceAsync(int id);
        Task<Invoice> CreateInvoiceAsync(CreateInvoiceRequest request);
        Task<List<Customer>> GetCustomersAsync();
        Task<Customer?> GetCustomerAsync(int id);
        Task<Customer> CreateCustomerAsync(Customer customer);
    }

    public class BillingService : IBillingService
    {
        private readonly BillingContext _context;

        public BillingService(BillingContext context)
        {
            _context = context;
        }

        public async Task<List<Invoice>> GetInvoicesAsync()
        {
            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .OrderByDescending(i => i.Date)
                .ToListAsync();
        }

        public async Task<Invoice?> GetInvoiceAsync(int id)
        {
            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<Invoice> CreateInvoiceAsync(CreateInvoiceRequest request)
        {
            var invoice = new Invoice
            {
                InvoiceNumber = $"INV-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}",
                Date = DateTime.Now,
                DueDate = request.DueDate,
                CustomerId = request.CustomerId,
                Status = InvoiceStatus.Draft
            };

            foreach (var item in request.Items)
            {
                var invoiceItem = new InvoiceItem
                {
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Total = item.Quantity * item.UnitPrice
                };
                invoice.Items.Add(invoiceItem);
            }

            invoice.SubTotal = invoice.Items.Sum(i => i.Total);
            invoice.TaxAmount = invoice.SubTotal * 0.1m; // 10% tax
            invoice.Total = invoice.SubTotal + invoice.TaxAmount;

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return await GetInvoiceAsync(invoice.Id) ?? invoice;
        }

        public async Task<List<Customer>> GetCustomersAsync()
        {
            return await _context.Customers.OrderBy(c => c.Name).ToListAsync();
        }

        public async Task<Customer?> GetCustomerAsync(int id)
        {
            return await _context.Customers
                .Include(c => c.Invoices)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Customer> CreateCustomerAsync(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }
    }
}
