using Microsoft.EntityFrameworkCore;
using BillingSystem.CustomerService.Entities;

namespace BillingSystem.CustomerService.Data
{
    public class CustomerDbContext : DbContext
    {
        public CustomerDbContext(DbContextOptions<CustomerDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Phone).HasMaxLength(50);
                entity.Property(e => e.Address).HasMaxLength(500);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                
                // Soft delete filter
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // Seed data
            modelBuilder.Entity<Customer>().HasData(
                new Customer
                {
                    Id = 1,
                    Name = "John Doe",
                    Email = "john.doe@example.com",
                    Phone = "+1-555-0101",
                    Address = "123 Main St, Anytown, USA",
                    TotalInvoices = 3,
                    TotalAmount = 1500.00m,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new Customer
                {
                    Id = 2,
                    Name = "Jane Smith",
                    Email = "jane.smith@example.com",
                    Phone = "+1-555-0102",
                    Address = "456 Oak Ave, Somewhere, USA",
                    TotalInvoices = 2,
                    TotalAmount = 2300.00m,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new Customer
                {
                    Id = 3,
                    Name = "Acme Corporation",
                    Email = "billing@acme.com",
                    Phone = "+1-555-0103",
                    Address = "789 Business Blvd, Corporate City, USA",
                    TotalInvoices = 5,
                    TotalAmount = 12500.00m,
                    CreatedBy = "System",
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                }
            );
        }
    }
}
