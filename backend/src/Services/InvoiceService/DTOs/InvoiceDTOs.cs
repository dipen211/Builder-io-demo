using BillingSystem.Shared.Common.DTOs;
using BillingSystem.InvoiceService.Entities;

namespace BillingSystem.InvoiceService.DTOs
{
    public class InvoiceDto : AuditableDto
    {
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public CustomerDto Customer { get; set; } = new();
        public decimal SubTotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<InvoiceItemDto> Items { get; set; } = new();
        public string? Notes { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public class InvoiceItemDto : BaseDto
    {
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Total { get; set; }
    }

    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class CreateInvoiceDto
    {
        public int CustomerId { get; set; }
        public DateTime DueDate { get; set; }
        public List<CreateInvoiceItemDto> Items { get; set; } = new();
        public string? Notes { get; set; }
    }

    public class CreateInvoiceItemDto
    {
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class InvoiceFilterDto
    {
        public string? Status { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public decimal? AmountMin { get; set; }
        public decimal? AmountMax { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "Date";
        public string? SortDirection { get; set; } = "desc";
    }

    public class SendInvoiceEmailRequest
    {
        public string? EmailAddress { get; set; }
    }
}
