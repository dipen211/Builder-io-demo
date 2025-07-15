using BillingSystem.Shared.EventBus.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace BillingSystem.Shared.EventBus
{
    public class InMemoryEventBus : IEventBus
    {
        private readonly ILogger<InMemoryEventBus> _logger;
        private readonly ConcurrentDictionary<string, List<Func<object, Task>>> _handlers;

        public InMemoryEventBus(ILogger<InMemoryEventBus> logger)
        {
            _logger = logger;
            _handlers = new ConcurrentDictionary<string, List<Func<object, Task>>>();
        }

        public async Task PublishAsync<T>(T eventData) where T : class
        {
            var eventType = typeof(T).Name;
            _logger.LogInformation("Publishing event {EventType} with data: {@EventData}", eventType, eventData);

            if (_handlers.TryGetValue(eventType, out var handlers))
            {
                var tasks = handlers.Select(handler => handler(eventData));
                await Task.WhenAll(tasks);
            }
        }

        public Task SubscribeAsync<T>(Func<T, Task> handler) where T : class
        {
            var eventType = typeof(T).Name;
            _logger.LogInformation("Subscribing to event {EventType}", eventType);

            _handlers.AddOrUpdate(
                eventType,
                new List<Func<object, Task>> { obj => handler((T)obj) },
                (key, existingHandlers) =>
                {
                    existingHandlers.Add(obj => handler((T)obj));
                    return existingHandlers;
                });

            return Task.CompletedTask;
        }
    }
}
