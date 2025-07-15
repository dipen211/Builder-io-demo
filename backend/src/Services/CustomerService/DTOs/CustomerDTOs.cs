using BillingSystem.Shared.Common.DTOs;

namespace BillingSystem.CustomerService.DTOs
{
    public class CustomerDto : AuditableDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int TotalInvoices { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime? LastInvoiceDate { get; set; }
    }

    public class CreateCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }

    public class UpdateCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }

    public class CustomerStatsDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int TotalInvoices { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal OverdueAmount { get; set; }
        public DateTime? LastInvoiceDate { get; set; }
        public DateTime? LastPaymentDate { get; set; }
    }
}
