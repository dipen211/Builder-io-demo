using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class BillingContext : DbContext
    {
        public BillingContext(DbContextOptions<BillingContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Invoice>()
                .Property(e => e.SubTotal)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Invoice>()
                .Property(e => e.TaxAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Invoice>()
                .Property(e => e.Total)
                .HasPrecision(18, 2);

            modelBuilder.Entity<InvoiceItem>()
                .Property(e => e.UnitPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<InvoiceItem>()
                .Property(e => e.Total)
                .HasPrecision(18, 2);
        }
    }

    public static class SeedData
    {
        public static void Initialize(BillingContext context)
        {
            if (context.Customers.Any())
                return;

            var customers = new[]
            {
                new Customer
                {
                    Name = "John Doe",
                    Email = "john@example.com",
                    Phone = "555-0101",
                    Address = "123 Main St, City, State 12345"
                },
                new Customer
                {
                    Name = "Jane Smith",
                    Email = "jane@example.com",
                    Phone = "555-0102",
                    Address = "456 Oak Ave, City, State 12345"
                },
                new Customer
                {
                    Name = "Acme Corp",
                    Email = "billing@acme.com",
                    Phone = "555-0103",
                    Address = "789 Business Blvd, City, State 12345"
                }
            };

            context.Customers.AddRange(customers);
            context.SaveChanges();
        }
    }
}
