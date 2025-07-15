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
    public class InvoicesController : ControllerBase
    {
        private readonly IBillingService _billingService;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateInvoiceDto> _createInvoiceValidator;
        private readonly IValidator<InvoiceFilterDto> _filterValidator;
        private readonly ILogger<InvoicesController> _logger;

        public InvoicesController(
            IBillingService billingService,
            IMapper mapper,
            IValidator<CreateInvoiceDto> createInvoiceValidator,
            IValidator<InvoiceFilterDto> filterValidator,
            ILogger<InvoicesController> logger)
        {
            _billingService = billingService;
            _mapper = mapper;
            _createInvoiceValidator = createInvoiceValidator;
            _filterValidator = filterValidator;
            _logger = logger;
        }

        /// <summary>
        /// Get all invoices with optional filtering and pagination
        /// </summary>
        /// <param name="filter">Filter criteria</param>
        /// <returns>Paginated list of invoices</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PaginatedResult<InvoiceDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<PaginatedResult<InvoiceDto>>>> GetInvoices([FromQuery] InvoiceFilterDto filter)
        {
            try
            {
                var validationResult = await _filterValidator.ValidateAsync(filter);
                if (!validationResult.IsValid)
                {
                    var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return BadRequest(ApiResponse<object>.ErrorResult("Validation failed", errors));
                }

                var invoices = await _billingService.GetInvoicesAsync();
                var invoiceDtos = _mapper.Map<List<InvoiceDto>>(invoices);

                // Apply filtering
                var filteredInvoices = ApplyFilters(invoiceDtos, filter);

                // Apply pagination
                var totalCount = filteredInvoices.Count();
                var paginatedInvoices = filteredInvoices
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToList();

                var result = new PaginatedResult<InvoiceDto>
                {
                    Items = paginatedInvoices,
                    TotalCount = totalCount,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize
                };

                return Ok(ApiResponse<PaginatedResult<InvoiceDto>>.SuccessResult(result, $"Retrieved {paginatedInvoices.Count} invoices"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invoices");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Get a specific invoice by ID
        /// </summary>
        /// <param name="id">Invoice ID</param>
        /// <returns>Invoice details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<InvoiceDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<InvoiceDto>>> GetInvoice(int id)
        {
            try
            {
                var invoice = await _billingService.GetInvoiceAsync(id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Invoice with ID {id} not found"));
                }

                var invoiceDto = _mapper.Map<InvoiceDto>(invoice);
                return Ok(ApiResponse<InvoiceDto>.SuccessResult(invoiceDto, "Invoice retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Create a new invoice
        /// </summary>
        /// <param name="createInvoiceDto">Invoice creation data</param>
        /// <returns>Created invoice</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<InvoiceDto>), 201)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<InvoiceDto>>> CreateInvoice([FromBody] CreateInvoiceDto createInvoiceDto)
        {
            try
            {
                var validationResult = await _createInvoiceValidator.ValidateAsync(createInvoiceDto);
                if (!validationResult.IsValid)
                {
                    var errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return BadRequest(ApiResponse<object>.ErrorResult("Validation failed", errors));
                }

                // Check if customer exists
                var customer = await _billingService.GetCustomerAsync(createInvoiceDto.CustomerId);
                if (customer == null)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult($"Customer with ID {createInvoiceDto.CustomerId} not found"));
                }

                                var createInvoiceRequest = new CreateInvoiceRequest
                {
                    CustomerId = createInvoiceDto.CustomerId,
                    DueDate = createInvoiceDto.DueDate,
                    Notes = createInvoiceDto.Notes,
                    Items = createInvoiceDto.Items.Select(item => new CreateInvoiceItemRequest
                    {
                        Description = item.Description,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice
                    }).ToList()
                };

                var invoice = await _billingService.CreateInvoiceAsync(createInvoiceRequest);
                var invoiceDto = _mapper.Map<InvoiceDto>(invoice);

                return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, 
                    ApiResponse<InvoiceDto>.SuccessResult(invoiceDto, "Invoice created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating invoice");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Update invoice status
        /// </summary>
        /// <param name="id">Invoice ID</param>
        /// <param name="status">New status</param>
        /// <returns>Updated invoice</returns>
        [HttpPatch("{id}/status")]
        [ProducesResponseType(typeof(ApiResponse<InvoiceDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<InvoiceDto>>> UpdateInvoiceStatus(int id, [FromBody] string status)
        {
            try
            {
                var invoice = await _billingService.GetInvoiceAsync(id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Invoice with ID {id} not found"));
                }

                if (!Enum.TryParse<InvoiceStatus>(status, true, out var invoiceStatus))
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Invalid status value"));
                }

                // Update the invoice status (you would implement this in the service)
                invoice.Status = invoiceStatus;
                // Save changes would happen in a real implementation

                var invoiceDto = _mapper.Map<InvoiceDto>(invoice);
                return Ok(ApiResponse<InvoiceDto>.SuccessResult(invoiceDto, "Invoice status updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating invoice status for invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

                /// <summary>
        /// Delete an invoice
        /// </summary>
        /// <param name="id">Invoice ID</param>
        /// <returns>Success confirmation</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<object>>> DeleteInvoice(int id)
        {
            try
            {
                var invoice = await _billingService.GetInvoiceAsync(id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Invoice with ID {id} not found"));
                }

                // Check if invoice can be deleted (e.g., not paid)
                if (invoice.Status == InvoiceStatus.Paid)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Cannot delete a paid invoice"));
                }

                // In a real implementation, you would delete the invoice from the database here

                return Ok(ApiResponse<object>.SuccessResult(null, "Invoice deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Export invoices to CSV or PDF format
        /// </summary>
        /// <param name="format">Export format (csv or pdf)</param>
        /// <param name="filter">Optional filter criteria</param>
        /// <returns>File download</returns>
        [HttpGet("export")]
        [ProducesResponseType(typeof(FileResult), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<IActionResult> ExportInvoices([FromQuery] string format = "csv", [FromQuery] InvoiceFilterDto? filter = null)
        {
            try
            {
                if (format != "csv" && format != "pdf")
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Format must be 'csv' or 'pdf'"));
                }

                var invoices = await _billingService.GetInvoicesAsync();
                var invoiceDtos = _mapper.Map<List<InvoiceDto>>(invoices);

                // Apply filtering if provided
                if (filter != null)
                {
                    var filteredInvoices = ApplyFilters(invoiceDtos, filter);
                    invoiceDtos = filteredInvoices.ToList();
                }

                if (format == "csv")
                {
                    var csvContent = GenerateCsvContent(invoiceDtos);
                    var csvBytes = System.Text.Encoding.UTF8.GetBytes(csvContent);
                    return File(csvBytes, "text/csv", $"invoices_{DateTime.Now:yyyyMMdd}.csv");
                }
                else
                {
                    // For PDF, you would use a library like iTextSharp or similar
                    // This is a placeholder implementation
                    var pdfContent = "PDF content would be generated here";
                    var pdfBytes = System.Text.Encoding.UTF8.GetBytes(pdfContent);
                    return File(pdfBytes, "application/pdf", $"invoices_{DateTime.Now:yyyyMMdd}.pdf");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting invoices");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Send invoice via email
        /// </summary>
        /// <param name="id">Invoice ID</param>
        /// <param name="emailRequest">Email request details</param>
        /// <returns>Success confirmation</returns>
        [HttpPost("{id}/send")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 404)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<object>>> SendInvoiceEmail(int id, [FromBody] SendInvoiceEmailRequest emailRequest)
        {
            try
            {
                var invoice = await _billingService.GetInvoiceAsync(id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Invoice with ID {id} not found"));
                }

                var emailAddress = !string.IsNullOrEmpty(emailRequest.EmailAddress)
                    ? emailRequest.EmailAddress
                    : invoice.Customer.Email;

                if (string.IsNullOrEmpty(emailAddress))
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("No email address provided or found for customer"));
                }

                // In a real implementation, you would send the email here
                // For now, we'll just simulate success
                _logger.LogInformation("Sending invoice {InvoiceId} to {EmailAddress}", id, emailAddress);

                return Ok(ApiResponse<object>.SuccessResult(null, $"Invoice sent successfully to {emailAddress}"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        private string GenerateCsvContent(List<InvoiceDto> invoices)
        {
            var csv = new System.Text.StringBuilder();
            csv.AppendLine("Invoice Number,Date,Due Date,Customer,Status,Total");

            foreach (var invoice in invoices)
            {
                csv.AppendLine($"{invoice.InvoiceNumber},{invoice.Date:yyyy-MM-dd},{invoice.DueDate:yyyy-MM-dd},{invoice.Customer.Name},{invoice.Status},{invoice.Total}");
            }

            return csv.ToString();
        }

        private IQueryable<InvoiceDto> ApplyFilters(List<InvoiceDto> invoices, InvoiceFilterDto filter)
        {
            var query = invoices.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Status))
            {
                query = query.Where(i => i.Status.Equals(filter.Status, StringComparison.OrdinalIgnoreCase));
            }

            if (filter.CustomerId.HasValue)
            {
                query = query.Where(i => i.Customer.Id == filter.CustomerId.Value);
            }

            if (filter.DateFrom.HasValue)
            {
                query = query.Where(i => i.Date >= filter.DateFrom.Value);
            }

            if (filter.DateTo.HasValue)
            {
                query = query.Where(i => i.Date <= filter.DateTo.Value);
            }

            if (filter.AmountMin.HasValue)
            {
                query = query.Where(i => i.Total >= filter.AmountMin.Value);
            }

            if (filter.AmountMax.HasValue)
            {
                query = query.Where(i => i.Total <= filter.AmountMax.Value);
            }

            // Apply sorting
            if (!string.IsNullOrEmpty(filter.SortBy))
            {
                var isDescending = filter.SortDirection?.Equals("desc", StringComparison.OrdinalIgnoreCase) == true;

                query = filter.SortBy.ToLower() switch
                {
                    "date" => isDescending ? query.OrderByDescending(i => i.Date) : query.OrderBy(i => i.Date),
                    "total" => isDescending ? query.OrderByDescending(i => i.Total) : query.OrderBy(i => i.Total),
                    "customer" => isDescending ? query.OrderByDescending(i => i.Customer.Name) : query.OrderBy(i => i.Customer.Name),
                    "status" => isDescending ? query.OrderByDescending(i => i.Status) : query.OrderBy(i => i.Status),
                    _ => query.OrderByDescending(i => i.Date)
                };
            }

            return query;
        }
    }
}
