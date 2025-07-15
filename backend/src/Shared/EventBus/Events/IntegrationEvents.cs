using BillingSystem.Shared.EventBus.Interfaces;

namespace BillingSystem.Shared.EventBus.Events
{
    public class CustomerCreatedEvent : BaseIntegrationEvent
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public override string EventType => "customer.created";
    }

    public class CustomerUpdatedEvent : BaseIntegrationEvent
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public override string EventType => "customer.updated";
    }

    public class CustomerDeletedEvent : BaseIntegrationEvent
    {
        public int CustomerId { get; set; }
        public override string EventType => "customer.deleted";
    }

    public class InvoiceCreatedEvent : BaseIntegrationEvent
    {
        public int InvoiceId { get; set; }
        public int CustomerId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public DateTime DueDate { get; set; }
        public override string EventType => "invoice.created";
    }

    public class InvoiceStatusChangedEvent : BaseIntegrationEvent
    {
        public int InvoiceId { get; set; }
        public int CustomerId { get; set; }
        public string OldStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public override string EventType => "invoice.status.changed";
    }

    public class InvoicePaidEvent : BaseIntegrationEvent
    {
        public int InvoiceId { get; set; }
        public int CustomerId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaidAt { get; set; }
        public override string EventType => "invoice.paid";
    }

    public class InvoiceDeletedEvent : BaseIntegrationEvent
    {
        public int InvoiceId { get; set; }
        public int CustomerId { get; set; }
        public decimal Amount { get; set; }
        public override string EventType => "invoice.deleted";
    }
}
