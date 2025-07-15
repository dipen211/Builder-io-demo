using BillingSystem.Shared.Common.Entities;

namespace BillingSystem.InvoiceService.Entities
{
    public class Invoice : SoftDeletableEntity
    {
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal Total { get; set; }
        public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;
        public string? Notes { get; set; }
        public List<InvoiceItem> Items { get; set; } = new();
        public DateTime? PaidAt { get; set; }
    }

    public class InvoiceItem : BaseEntity
    {
        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total { get; set; }
    }

    public enum InvoiceStatus
    {
        Draft = 0,
        Sent = 1,
        Pending = 2,
        Paid = 3,
        Overdue = 4,
        Cancelled = 5
    }
}
