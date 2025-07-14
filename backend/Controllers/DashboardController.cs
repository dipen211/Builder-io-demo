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
    }
}
