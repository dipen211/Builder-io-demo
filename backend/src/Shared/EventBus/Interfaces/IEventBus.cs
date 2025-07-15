namespace BillingSystem.Shared.EventBus.Interfaces
{
    public interface IEventBus
    {
        Task PublishAsync<T>(T eventData) where T : class;
        Task SubscribeAsync<T>(Func<T, Task> handler) where T : class;
    }

    public interface IIntegrationEvent
    {
        Guid Id { get; }
        DateTime CreatedAt { get; }
        string EventType { get; }
    }

    public abstract class BaseIntegrationEvent : IIntegrationEvent
    {
        public Guid Id { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public abstract string EventType { get; }

        protected BaseIntegrationEvent()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }
    }
}
