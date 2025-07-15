namespace BillingSystem.DashboardService.DTOs
{
    public class DashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int PendingInvoices { get; set; }
        public int TotalCustomers { get; set; }
        public int OverdueInvoices { get; set; }
        public decimal PendingAmount { get; set; }
        public decimal OverdueAmount { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public decimal MonthlyGrowth { get; set; }
    }

    public class InvoiceDto
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime DueDate { get; set; }
        public CustomerDto Customer { get; set; } = new();
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class ActivityDto
    {
        public string Type { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
