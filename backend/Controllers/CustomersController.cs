using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using FluentValidation;
using backend.Models;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CustomersController : ControllerBase
    {
        private readonly IBillingService _billingService;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateCustomerDto> _createCustomerValidator;
        private readonly IValidator<UpdateCustomerDto> _updateCustomerValidator;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(
            IBillingService billingService,
            IMapper mapper,
            IValidator<CreateCustomerDto> createCustomerValidator,
            IValidator<UpdateCustomerDto> updateCustomerValidator,
            ILogger<CustomersController> logger)
        {
            _billingService = billingService;
            _mapper = mapper;
            _createCustomerValidator = createCustomerValidator;
            _updateCustomerValidator = updateCustomerValidator;
            _logger = logger;
        }

        /// <summary>
        /// Get all customers with optional search and pagination
        /// </summary>
        /// <param name="search">Search term for customer name or email</param>
        /// <param name="pageNumber">Page number (default: 1)</param>
        /// <param name="pageSize">Page size (default: 10, max: 100)</param>
        /// <returns>Paginated list of customers</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PaginatedResult<CustomerDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<PaginatedResult<CustomerDto>>>> GetCustomers(
            [FromQuery] string? search = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                if (pageNumber <= 0)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Page number must be greater than 0"));
                }

                if (pageSize <= 0 || pageSize > 100)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Page size must be between 1 and 100"));
                }

                var customers = await _billingService.GetCustomersAsync();
                var customerDtos = _mapper.Map<List<CustomerDto>>(customers);

                // Apply search filter
                if (!string.IsNullOrEmpty(search))
                {
                    customerDtos = customerDtos.Where(c => 
                        c.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        c.Email.Contains(search, StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                // Apply pagination
                var totalCount = customerDtos.Count;
                var paginatedCustomers = customerDtos
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new PaginatedResult<CustomerDto>
                {
                    Items = paginatedCustomers,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };

                return Ok(ApiResponse<PaginatedResult<CustomerDto>>.SuccessResult(result, $"Retrieved {paginatedCustomers.Count} customers"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customers");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Get a specific customer by ID
        /// </summary>
        /// <param name="id">Customer ID</param>
        /// <returns>Customer details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<CustomerDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> GetCustomer(int id)
        {
            try
            {
                var customer = await _billingService.GetCustomerAsync(id);
                if (customer == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Customer with ID {id} not found"));
                }

                var customerDto = _mapper.Map<CustomerDto>(customer);
                return Ok(ApiResponse<CustomerDto>.SuccessResult(customerDto, "Customer retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customer {CustomerId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Create a new customer
        /// </summary>
        /// <param name="createCustomerDto">Customer creation data</param>
        /// <returns>Created customer</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<CustomerDto>), 201)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> CreateCustomer([FromBody] CreateCustomerDto createCustomerDto)
        {
            try
            {
                var validationResult = await _createCustomerValidator.ValidateAsync(createCustomerDto);
                if (!validationResult.IsValid)
                {
                    var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return BadRequest(ApiResponse<object>.ErrorResult("Validation failed", errors));
                }

                // Check if email already exists
                var existingCustomers = await _billingService.GetCustomersAsync();
                if (existingCustomers.Any(c => c.Email.Equals(createCustomerDto.Email, StringComparison.OrdinalIgnoreCase)))
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("A customer with this email already exists"));
                }

                var customer = _mapper.Map<Customer>(createCustomerDto);
                var createdCustomer = await _billingService.CreateCustomerAsync(customer);
                var customerDto = _mapper.Map<CustomerDto>(createdCustomer);

                return CreatedAtAction(nameof(GetCustomer), new { id = createdCustomer.Id }, 
                    ApiResponse<CustomerDto>.SuccessResult(customerDto, "Customer created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating customer");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Update an existing customer
        /// </summary>
        /// <param name="id">Customer ID</param>
        /// <param name="updateCustomerDto">Customer update data</param>
        /// <returns>Updated customer</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<CustomerDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> UpdateCustomer(int id, [FromBody] UpdateCustomerDto updateCustomerDto)
        {
            try
            {
                var validationResult = await _updateCustomerValidator.ValidateAsync(updateCustomerDto);
                if (!validationResult.IsValid)
                {
                    var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return BadRequest(ApiResponse<object>.ErrorResult("Validation failed", errors));
                }

                var existingCustomer = await _billingService.GetCustomerAsync(id);
                if (existingCustomer == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Customer with ID {id} not found"));
                }

                // Check if email is being changed and if it already exists
                var existingCustomers = await _billingService.GetCustomersAsync();
                if (existingCustomers.Any(c => c.Id != id && c.Email.Equals(updateCustomerDto.Email, StringComparison.OrdinalIgnoreCase)))
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("A customer with this email already exists"));
                }

                // Update customer properties
                existingCustomer.Name = updateCustomerDto.Name;
                existingCustomer.Email = updateCustomerDto.Email;
                existingCustomer.Phone = updateCustomerDto.Phone;
                existingCustomer.Address = updateCustomerDto.Address;

                // In a real implementation, you would save changes to the database here
                
                var customerDto = _mapper.Map<CustomerDto>(existingCustomer);
                return Ok(ApiResponse<CustomerDto>.SuccessResult(customerDto, "Customer updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating customer {CustomerId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Delete a customer
        /// </summary>
        /// <param name="id">Customer ID</param>
        /// <returns>Success confirmation</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteCustomer(int id)
        {
            try
            {
                var customer = await _billingService.GetCustomerAsync(id);
                if (customer == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Customer with ID {id} not found"));
                }

                // Check if customer has invoices
                if (customer.Invoices.Any())
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Cannot delete customer with existing invoices"));
                }

                // In a real implementation, you would delete the customer from the database here
                
                return Ok(ApiResponse<object>.SuccessResult(null, "Customer deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting customer {CustomerId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Get customer's invoice history
        /// </summary>
        /// <param name="id">Customer ID</param>
        /// <returns>List of customer's invoices</returns>
        [HttpGet("{id}/invoices")]
        [ProducesResponseType(typeof(ApiResponse<List<InvoiceDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<List<InvoiceDto>>>> GetCustomerInvoices(int id)
        {
            try
            {
                var customer = await _billingService.GetCustomerAsync(id);
                if (customer == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Customer with ID {id} not found"));
                }

                var invoiceDtos = _mapper.Map<List<InvoiceDto>>(customer.Invoices);
                return Ok(ApiResponse<List<InvoiceDto>>.SuccessResult(invoiceDtos, $"Retrieved {invoiceDtos.Count} invoices for customer"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invoices for customer {CustomerId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }
    }
}
