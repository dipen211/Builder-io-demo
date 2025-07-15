using AutoMapper;
using BillingSystem.CustomerService.DTOs;
using BillingSystem.CustomerService.Entities;
using BillingSystem.CustomerService.Repositories;
using BillingSystem.Shared.Common.DTOs;
using BillingSystem.Shared.EventBus.Interfaces;
using BillingSystem.Shared.EventBus.Events;

namespace BillingSystem.CustomerService.Services
{
    public interface ICustomerBusinessService
    {
        Task<PaginatedResult<CustomerDto>> GetCustomersAsync(int pageNumber = 1, int pageSize = 10, string? searchTerm = null);
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createCustomerDto);
        Task<CustomerDto> UpdateCustomerAsync(int id, UpdateCustomerDto updateCustomerDto);
        Task DeleteCustomerAsync(int id);
        Task<CustomerStatsDto?> GetCustomerStatsAsync(int id);
        Task UpdateCustomerStatsAsync(int customerId, int totalInvoices, decimal totalAmount);
    }

    public class CustomerBusinessService : ICustomerBusinessService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IMapper _mapper;
        private readonly IEventBus _eventBus;
        private readonly ILogger<CustomerBusinessService> _logger;

        public CustomerBusinessService(
            ICustomerRepository customerRepository,
            IMapper mapper,
            IEventBus eventBus,
            ILogger<CustomerBusinessService> logger)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
            _eventBus = eventBus;
            _logger = logger;
        }

        public async Task<PaginatedResult<CustomerDto>> GetCustomersAsync(int pageNumber = 1, int pageSize = 10, string? searchTerm = null)
        {
            var paginatedCustomers = await _customerRepository.GetPaginatedAsync(pageNumber, pageSize, searchTerm);
            var customerDtos = _mapper.Map<List<CustomerDto>>(paginatedCustomers.Items);

            return new PaginatedResult<CustomerDto>
            {
                Items = customerDtos,
                TotalCount = paginatedCustomers.TotalCount,
                PageNumber = paginatedCustomers.PageNumber,
                PageSize = paginatedCustomers.PageSize
            };
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            return customer != null ? _mapper.Map<CustomerDto>(customer) : null;
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createCustomerDto)
        {
            // Check if email already exists
            if (await _customerRepository.EmailExistsAsync(createCustomerDto.Email))
            {
                throw new InvalidOperationException("A customer with this email already exists");
            }

            var customer = _mapper.Map<Customer>(createCustomerDto);
            customer.CreatedBy = "System"; // In real app, get from auth context

            var createdCustomer = await _customerRepository.AddAsync(customer);
            var customerDto = _mapper.Map<CustomerDto>(createdCustomer);

            // Publish event
            await _eventBus.PublishAsync(new CustomerCreatedEvent
            {
                CustomerId = createdCustomer.Id,
                CustomerName = createdCustomer.Name,
                Email = createdCustomer.Email
            });

            _logger.LogInformation("Customer {CustomerId} created successfully", createdCustomer.Id);

            return customerDto;
        }

        public async Task<CustomerDto> UpdateCustomerAsync(int id, UpdateCustomerDto updateCustomerDto)
        {
            var existingCustomer = await _customerRepository.GetByIdAsync(id);
            if (existingCustomer == null)
            {
                throw new KeyNotFoundException($"Customer with ID {id} not found");
            }

            // Check if email is being changed and if it already exists
            if (existingCustomer.Email != updateCustomerDto.Email && 
                await _customerRepository.EmailExistsAsync(updateCustomerDto.Email, id))
            {
                throw new InvalidOperationException("A customer with this email already exists");
            }

            _mapper.Map(updateCustomerDto, existingCustomer);
            existingCustomer.UpdatedBy = "System"; // In real app, get from auth context

            var updatedCustomer = await _customerRepository.UpdateAsync(existingCustomer);
            var customerDto = _mapper.Map<CustomerDto>(updatedCustomer);

            // Publish event
            await _eventBus.PublishAsync(new CustomerUpdatedEvent
            {
                CustomerId = updatedCustomer.Id,
                CustomerName = updatedCustomer.Name,
                Email = updatedCustomer.Email
            });

            _logger.LogInformation("Customer {CustomerId} updated successfully", id);

            return customerDto;
        }

        public async Task DeleteCustomerAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            if (customer == null)
            {
                throw new KeyNotFoundException($"Customer with ID {id} not found");
            }

            // In a real implementation, check if customer has invoices before deleting
            // For now, we'll allow soft delete
            customer.DeletedBy = "System"; // In real app, get from auth context
            await _customerRepository.DeleteAsync(id);

            // Publish event
            await _eventBus.PublishAsync(new CustomerDeletedEvent
            {
                CustomerId = id
            });

            _logger.LogInformation("Customer {CustomerId} deleted successfully", id);
        }

        public async Task<CustomerStatsDto?> GetCustomerStatsAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            if (customer == null)
            {
                return null;
            }

            return new CustomerStatsDto
            {
                CustomerId = customer.Id,
                CustomerName = customer.Name,
                TotalInvoices = customer.TotalInvoices,
                TotalAmount = customer.TotalAmount,
                LastInvoiceDate = customer.LastInvoiceDate
            };
        }

        public async Task UpdateCustomerStatsAsync(int customerId, int totalInvoices, decimal totalAmount)
        {
            await _customerRepository.UpdateStatsAsync(customerId, totalInvoices, totalAmount);
            _logger.LogInformation("Customer {CustomerId} stats updated: {TotalInvoices} invoices, {TotalAmount} total", 
                customerId, totalInvoices, totalAmount);
        }
    }
}
