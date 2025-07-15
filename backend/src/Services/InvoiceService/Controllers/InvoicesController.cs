using Microsoft.AspNetCore.Mvc;
using BillingSystem.InvoiceService.DTOs;
using BillingSystem.Shared.Common.DTOs;

namespace BillingSystem.InvoiceService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class InvoicesController : ControllerBase
    {
        private readonly ILogger<InvoicesController> _logger;

        public InvoicesController(ILogger<InvoicesController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PaginatedResult<InvoiceDto>>>> GetInvoices([FromQuery] InvoiceFilterDto filter)
        {
            try
            {
                // Mock data for now
                var invoices = GetMockInvoices();
                var result = new PaginatedResult<InvoiceDto>
                {
                    Items = invoices,
                    TotalCount = invoices.Count,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize
                };

                return Ok(ApiResponse<PaginatedResult<InvoiceDto>>.SuccessResult(result, $"Retrieved {invoices.Count} invoices"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invoices");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<InvoiceDto>>> GetInvoice(int id)
        {
            try
            {
                var invoice = GetMockInvoices().FirstOrDefault(i => i.Id == id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Invoice with ID {id} not found"));
                }

                return Ok(ApiResponse<InvoiceDto>.SuccessResult(invoice, "Invoice retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<InvoiceDto>>> CreateInvoice([FromBody] CreateInvoiceDto createInvoiceDto)
        {
            try
            {
                var invoice = new InvoiceDto
                {
                    Id = new Random().Next(1000, 9999),
                    InvoiceNumber = $"INV-{DateTime.Now:yyyyMMdd}-{new Random().Next(100, 999)}",
                    Date = DateTime.UtcNow,
                    DueDate = createInvoiceDto.DueDate,
                    Customer = new CustomerDto { Id = createInvoiceDto.CustomerId, Name = "Mock Customer", Email = "customer@example.com" },
                    Items = createInvoiceDto.Items.Select(i => new InvoiceItemDto
                    {
                        Description = i.Description,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        Total = i.Quantity * i.UnitPrice
                    }).ToList(),
                    Status = "Draft",
                    CreatedAt = DateTime.UtcNow
                };

                invoice.SubTotal = invoice.Items.Sum(i => i.Total);
                invoice.TaxAmount = invoice.SubTotal * 0.1m;
                invoice.Total = invoice.SubTotal + invoice.TaxAmount;

                return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id },
                    ApiResponse<InvoiceDto>.SuccessResult(invoice, "Invoice created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating invoice");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<InvoiceDto>>> UpdateInvoiceStatus(int id, [FromBody] string status)
        {
            try
            {
                var invoice = GetMockInvoices().FirstOrDefault(i => i.Id == id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Invoice with ID {id} not found"));
                }

                invoice.Status = status;
                if (status.Equals("Paid", StringComparison.OrdinalIgnoreCase))
                {
                    invoice.PaidAt = DateTime.UtcNow;
                }

                return Ok(ApiResponse<InvoiceDto>.SuccessResult(invoice, "Invoice status updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating invoice status for invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteInvoice(int id)
        {
            try
            {
                return Ok(ApiResponse<object>.SuccessResult(null, "Invoice deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportInvoices([FromQuery] string format = "csv")
        {
            try
            {
                if (format == "csv")
                {
                    var csvContent = "Invoice Number,Date,Customer,Total,Status\n";
                    csvContent += "INV-001,2024-01-01,John Doe,1500.00,Paid\n";
                    csvContent += "INV-002,2024-01-02,Jane Smith,2300.00,Pending\n";

                    var csvBytes = System.Text.Encoding.UTF8.GetBytes(csvContent);
                    return File(csvBytes, "text/csv", $"invoices_{DateTime.Now:yyyyMMdd}.csv");
                }

                return BadRequest(ApiResponse<object>.ErrorResult("Only CSV format is supported"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting invoices");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpPost("{id}/send")]
        public async Task<ActionResult<ApiResponse<object>>> SendInvoiceEmail(int id, [FromBody] SendInvoiceEmailRequest emailRequest)
        {
            try
            {
                var invoice = GetMockInvoices().FirstOrDefault(i => i.Id == id);
                if (invoice == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResult($"Invoice with ID {id} not found"));
                }

                var emailAddress = !string.IsNullOrEmpty(emailRequest.EmailAddress) 
                    ? emailRequest.EmailAddress 
                    : invoice.Customer.Email;

                _logger.LogInformation("Sending invoice {InvoiceId} to {EmailAddress}", id, emailAddress);
                
                return Ok(ApiResponse<object>.SuccessResult(null, $"Invoice sent successfully to {emailAddress}"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending invoice {InvoiceId}", id);
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        private List<InvoiceDto> GetMockInvoices()
        {
            return new List<InvoiceDto>
            {
                new InvoiceDto
                {
                    Id = 1,
                    InvoiceNumber = "INV-20240101-001",
                    Date = DateTime.UtcNow.AddDays(-10),
                    DueDate = DateTime.UtcNow.AddDays(20),
                    Customer = new CustomerDto { Id = 1, Name = "John Doe", Email = "john.doe@example.com" },
                    SubTotal = 1363.64m,
                    TaxAmount = 136.36m,
                    Total = 1500.00m,
                    Status = "Paid",
                    Items = new List<InvoiceItemDto>
                    {
                        new InvoiceItemDto { Id = 1, Description = "Web Development", Quantity = 40, UnitPrice = 50.00m, Total = 2000.00m },
                        new InvoiceItemDto { Id = 2, Description = "UI/UX Design", Quantity = 20, UnitPrice = 75.00m, Total = 1500.00m }
                    },
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    PaidAt = DateTime.UtcNow.AddDays(-5)
                },
                new InvoiceDto
                {
                    Id = 2,
                    InvoiceNumber = "INV-20240102-002",
                    Date = DateTime.UtcNow.AddDays(-5),
                    DueDate = DateTime.UtcNow.AddDays(25),
                    Customer = new CustomerDto { Id = 2, Name = "Jane Smith", Email = "jane.smith@example.com" },
                    SubTotal = 2090.91m,
                    TaxAmount = 209.09m,
                    Total = 2300.00m,
                    Status = "Pending",
                    Items = new List<InvoiceItemDto>
                    {
                        new InvoiceItemDto { Id = 3, Description = "Database Setup", Quantity = 10, UnitPrice = 100.00m, Total = 1000.00m },
                        new InvoiceItemDto { Id = 4, Description = "API Development", Quantity = 30, UnitPrice = 60.00m, Total = 1800.00m }
                    },
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new InvoiceDto
                {
                    Id = 3,
                    InvoiceNumber = "INV-20240103-003",
                    Date = DateTime.UtcNow.AddDays(-2),
                    DueDate = DateTime.UtcNow.AddDays(28),
                    Customer = new CustomerDto { Id = 3, Name = "Acme Corporation", Email = "billing@acme.com" },
                    SubTotal = 4545.45m,
                    TaxAmount = 454.55m,
                    Total = 5000.00m,
                    Status = "Sent",
                    Items = new List<InvoiceItemDto>
                    {
                        new InvoiceItemDto { Id = 5, Description = "Enterprise Solution", Quantity = 1, UnitPrice = 5000.00m, Total = 5000.00m }
                    },
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                }
            };
        }
    }
}
