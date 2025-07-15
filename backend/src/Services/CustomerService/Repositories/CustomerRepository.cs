using Microsoft.EntityFrameworkCore;
using BillingSystem.CustomerService.Data;
using BillingSystem.CustomerService.Entities;
using BillingSystem.Shared.Common.Interfaces;
using System.Linq.Expressions;

namespace BillingSystem.CustomerService.Repositories
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<IEnumerable<Customer>> SearchAsync(string searchTerm);
        Task<Customer?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email, int? excludeCustomerId = null);
        Task<PaginatedResult<Customer>> GetPaginatedAsync(int pageNumber, int pageSize, string? searchTerm = null);
        Task UpdateStatsAsync(int customerId, int totalInvoices, decimal totalAmount);
    }

    public class CustomerRepository : ICustomerRepository
    {
        private readonly CustomerDbContext _context;

        public CustomerRepository(CustomerDbContext context)
        {
            _context = context;
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            return await _context.Customers.OrderBy(c => c.Name).ToListAsync();
        }

        public async Task<IEnumerable<Customer>> FindAsync(Expression<Func<Customer, bool>> predicate)
        {
            return await _context.Customers.Where(predicate).ToListAsync();
        }

        public async Task<Customer> AddAsync(Customer entity)
        {
            entity.CreatedAt = DateTime.UtcNow;
            _context.Customers.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Customer> UpdateAsync(Customer entity)
        {
            entity.UpdatedAt = DateTime.UtcNow;
            _context.Customers.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var customer = await GetByIdAsync(id);
            if (customer != null)
            {
                customer.IsDeleted = true;
                customer.DeletedAt = DateTime.UtcNow;
                await UpdateAsync(customer);
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Customers.AnyAsync(c => c.Id == id);
        }

        public async Task<int> CountAsync()
        {
            return await _context.Customers.CountAsync();
        }

        public async Task<int> CountAsync(Expression<Func<Customer, bool>> predicate)
        {
            return await _context.Customers.CountAsync(predicate);
        }

        public async Task<IEnumerable<Customer>> SearchAsync(string searchTerm)
        {
            return await _context.Customers
                .Where(c => c.Name.Contains(searchTerm) || c.Email.Contains(searchTerm))
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<Customer?> GetByEmailAsync(string email)
        {
            return await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeCustomerId = null)
        {
            var query = _context.Customers.Where(c => c.Email == email);
            if (excludeCustomerId.HasValue)
            {
                query = query.Where(c => c.Id != excludeCustomerId.Value);
            }
            return await query.AnyAsync();
        }

        public async Task<PaginatedResult<Customer>> GetPaginatedAsync(int pageNumber, int pageSize, string? searchTerm = null)
        {
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(c => c.Name.Contains(searchTerm) || c.Email.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(c => c.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResult<Customer>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task UpdateStatsAsync(int customerId, int totalInvoices, decimal totalAmount)
        {
            var customer = await GetByIdAsync(customerId);
            if (customer != null)
            {
                customer.TotalInvoices = totalInvoices;
                customer.TotalAmount = totalAmount;
                customer.LastInvoiceDate = DateTime.UtcNow;
                await UpdateAsync(customer);
            }
        }
    }

    public class PaginatedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasNextPage => PageNumber < TotalPages;
        public bool HasPreviousPage => PageNumber > 1;
    }
}
