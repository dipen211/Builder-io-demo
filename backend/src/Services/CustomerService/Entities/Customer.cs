using BillingSystem.Shared.Common.Entities;

namespace BillingSystem.CustomerService.Entities
{
    public class Customer : SoftDeletableEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        
        // Statistics
        public int TotalInvoices { get; set; } = 0;
        public decimal TotalAmount { get; set; } = 0m;
        public DateTime? LastInvoiceDate { get; set; }
    }
}
