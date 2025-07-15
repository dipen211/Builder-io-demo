using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Get dashboard statistics including revenue, invoice counts, and customer metrics
        /// </summary>
        /// <returns>Dashboard statistics</returns>
        [HttpGet("stats")]
        [ProducesResponseType(typeof(ApiResponse<DashboardStatsDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
                return Ok(ApiResponse<DashboardStatsDto>.SuccessResult(stats, "Dashboard statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard statistics");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Get recent invoices for dashboard display
        /// </summary>
        /// <param name="count">Number of recent invoices to retrieve (default: 5)</param>
        /// <returns>List of recent invoices</returns>
        [HttpGet("recent-invoices")]
        [ProducesResponseType(typeof(ApiResponse<List<InvoiceDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<List<InvoiceDto>>>> GetRecentInvoices([FromQuery] int count = 5)
        {
            try
            {
                if (count <= 0 || count > 50)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Count must be between 1 and 50"));
                }

                var invoices = await _dashboardService.GetRecentInvoicesAsync(count);
                return Ok(ApiResponse<List<InvoiceDto>>.SuccessResult(invoices, $"Retrieved {invoices.Count} recent invoices"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent invoices");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

                /// <summary>
        /// Get combined dashboard data including stats and recent invoices
        /// </summary>
        /// <returns>Complete dashboard data</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<object>>> GetDashboardData()
        {
            try
            {
                var statsTask = _dashboardService.GetDashboardStatsAsync();
                var recentInvoicesTask = _dashboardService.GetRecentInvoicesAsync(5);

                await Task.WhenAll(statsTask, recentInvoicesTask);

                var dashboardData = new
                {
                    Stats = await statsTask,
                    RecentInvoices = await recentInvoicesTask
                };

                return Ok(ApiResponse<object>.SuccessResult(dashboardData, "Dashboard data retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard data");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Get recent dashboard activity
        /// </summary>
        /// <param name="limit">Number of activity items to retrieve (default: 10)</param>
        /// <returns>List of recent activities</returns>
        [HttpGet("activity")]
        [ProducesResponseType(typeof(ApiResponse<List<object>>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 400)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<List<object>>>> GetRecentActivity([FromQuery] int limit = 10)
        {
            try
            {
                if (limit <= 0 || limit > 100)
                {
                    return BadRequest(ApiResponse<object>.ErrorResult("Limit must be between 1 and 100"));
                }

                // In a real implementation, you would get recent activities from the database
                // For now, we'll simulate some activity data
                var activities = new List<object>
                {
                    new { Type = "Invoice", Action = "Created", Description = "Invoice #INV-001 created", Timestamp = DateTime.UtcNow.AddMinutes(-5) },
                    new { Type = "Customer", Action = "Added", Description = "New customer added: John Doe", Timestamp = DateTime.UtcNow.AddMinutes(-15) },
                    new { Type = "Invoice", Action = "Paid", Description = "Invoice #INV-002 marked as paid", Timestamp = DateTime.UtcNow.AddMinutes(-30) },
                    new { Type = "Invoice", Action = "Sent", Description = "Invoice #INV-003 sent via email", Timestamp = DateTime.UtcNow.AddHours(-1) },
                    new { Type = "Customer", Action = "Updated", Description = "Customer information updated: Jane Smith", Timestamp = DateTime.UtcNow.AddHours(-2) }
                };

                var limitedActivities = activities.Take(limit).ToList();
                return Ok(ApiResponse<List<object>>.SuccessResult(limitedActivities, $"Retrieved {limitedActivities.Count} recent activities"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activity");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }

        /// <summary>
        /// Refresh dashboard data (force refresh of cached data)
        /// </summary>
        /// <returns>Refreshed dashboard data</returns>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(ApiResponse<object>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<object>>> RefreshDashboard()
        {
            try
            {
                // In a real implementation, you would clear cache and reload data
                var statsTask = _dashboardService.GetDashboardStatsAsync();
                var recentInvoicesTask = _dashboardService.GetRecentInvoicesAsync(5);

                await Task.WhenAll(statsTask, recentInvoicesTask);

                var dashboardData = new
                {
                    Stats = await statsTask,
                    RecentInvoices = await recentInvoicesTask,
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
    }
}
