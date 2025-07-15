using Microsoft.AspNetCore.Mvc;
using BillingSystem.DashboardService.DTOs;
using BillingSystem.Shared.Common.DTOs;

namespace BillingSystem.DashboardService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class DashboardController : ControllerBase
    {
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ILogger<DashboardController> logger)
        {
            _logger = logger;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
        {
            try
            {
                var stats = new DashboardStatsDto
                {
                    TotalRevenue = 25850.00m,
                    PendingInvoices = 12,
                    TotalCustomers = 45,
                    OverdueInvoices = 3,
                    PendingAmount = 8500.00m,
                    OverdueAmount = 2300.00m,
                    MonthlyRevenue = 15750.00m,
                    MonthlyGrowth = 12.5m
                };

                return Ok(ApiResponse<DashboardStatsDto>.SuccessResult(stats, "Dashboard statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard statistics");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpGet("recent-invoices")]
        public async Task<ActionResult<ApiResponse<List<InvoiceDto>>>> GetRecentInvoices([FromQuery] int count = 5)
        {
            try
            {
                if (count <= 0 || count > 50)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Count must be between 1 and 50"));
                }

                var invoices = GetMockRecentInvoices().Take(count).ToList();
                return Ok(ApiResponse<List<InvoiceDto>>.SuccessResult(invoices, $"Retrieved {invoices.Count} recent invoices"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent invoices");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<object>>> GetDashboardData()
        {
            try
            {
                var stats = new DashboardStatsDto
                {
                    TotalRevenue = 25850.00m,
                    PendingInvoices = 12,
                    TotalCustomers = 45,
                    OverdueInvoices = 3,
                    PendingAmount = 8500.00m,
                    OverdueAmount = 2300.00m,
                    MonthlyRevenue = 15750.00m,
                    MonthlyGrowth = 12.5m
                };

                var recentInvoices = GetMockRecentInvoices().Take(5).ToList();

                var dashboardData = new
                {
                    Stats = stats,
                    RecentInvoices = recentInvoices
                };

                return Ok(ApiResponse<object>.SuccessResult(dashboardData, "Dashboard data retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard data");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpGet("activity")]
        public async Task<ActionResult<ApiResponse<List<ActivityDto>>>> GetRecentActivity([FromQuery] int limit = 10)
        {
            try
            {
                if (limit <= 0 || limit > 100)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Limit must be between 1 and 100"));
                }

                var activities = new List<ActivityDto>
                {
                    new ActivityDto { Type = "Invoice", Action = "Created", Description = "Invoice #INV-001 created for John Doe", Timestamp = DateTime.UtcNow.AddMinutes(-5) },
                    new ActivityDto { Type = "Customer", Action = "Added", Description = "New customer added: Jane Smith", Timestamp = DateTime.UtcNow.AddMinutes(-15) },
                    new ActivityDto { Type = "Invoice", Action = "Paid", Description = "Invoice #INV-002 marked as paid", Timestamp = DateTime.UtcNow.AddMinutes(-30) },
                    new ActivityDto { Type = "Invoice", Action = "Sent", Description = "Invoice #INV-003 sent via email", Timestamp = DateTime.UtcNow.AddHours(-1) },
                    new ActivityDto { Type = "Customer", Action = "Updated", Description = "Customer information updated: Acme Corp", Timestamp = DateTime.UtcNow.AddHours(-2) }
                };

                var limitedActivities = activities.Take(limit).ToList();
                return Ok(ApiResponse<List<ActivityDto>>.SuccessResult(limitedActivities, $"Retrieved {limitedActivities.Count} recent activities"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activity");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<ApiResponse<object>>> RefreshDashboard()
        {
            try
            {
                var stats = new DashboardStatsDto
                {
                    TotalRevenue = 25850.00m,
                    PendingInvoices = 12,
                    TotalCustomers = 45,
                    OverdueInvoices = 3,
                    PendingAmount = 8500.00m,
                    OverdueAmount = 2300.00m,
                    MonthlyRevenue = 15750.00m,
                    MonthlyGrowth = 12.5m
                };

                var recentInvoices = GetMockRecentInvoices().Take(5).ToList();

                var dashboardData = new
                {
                    Stats = stats,
                    RecentInvoices = recentInvoices,
                    RefreshedAt = DateTime.UtcNow
                };

                return Ok(ApiResponse<object>.SuccessResult(dashboardData, "Dashboard data refreshed successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error refreshing dashboard data");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        private List<InvoiceDto> GetMockRecentInvoices()
        {
            return new List<InvoiceDto>
            {
                new InvoiceDto
                {
                    Id = 1,
                    InvoiceNumber = "INV-20240101-001",
                    Date = DateTime.UtcNow.AddDays(-1),
                    DueDate = DateTime.UtcNow.AddDays(29),
                    Customer = new CustomerDto { Id = 1, Name = "John Doe", Email = "john.doe@example.com" },
                    Total = 1500.00m,
                    Status = "Sent"
                },
                new InvoiceDto
                {
                    Id = 2,
                    InvoiceNumber = "INV-20240102-002",
                    Date = DateTime.UtcNow.AddDays(-2),
                    DueDate = DateTime.UtcNow.AddDays(28),
                    Customer = new CustomerDto { Id = 2, Name = "Jane Smith", Email = "jane.smith@example.com" },
                    Total = 2300.00m,
                    Status = "Pending"
                },
                new InvoiceDto
                {
                    Id = 3,
                    InvoiceNumber = "INV-20240103-003",
                    Date = DateTime.UtcNow.AddDays(-3),
                    DueDate = DateTime.UtcNow.AddDays(27),
                    Customer = new CustomerDto { Id = 3, Name = "Acme Corporation", Email = "billing@acme.com" },
                    Total = 5000.00m,
                    Status = "Paid"
                }
            };
        }
    }
}
