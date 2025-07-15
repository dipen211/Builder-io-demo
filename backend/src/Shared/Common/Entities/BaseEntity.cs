using BillingSystem.Shared.Common.Interfaces;

namespace BillingSystem.Shared.Common.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }

    public abstract class AuditableEntity : BaseEntity, IAuditable
    {
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }
    }

    public abstract class SoftDeletableEntity : AuditableEntity, ISoftDeletable
    {
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
    }
}
