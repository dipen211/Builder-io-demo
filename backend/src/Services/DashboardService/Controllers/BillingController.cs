using Microsoft.AspNetCore.Mvc;
using BillingSystem.DashboardService.DTOs;
using BillingSystem.Shared.Common.DTOs;

namespace BillingSystem.DashboardService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class BillingController : ControllerBase
    {
        private readonly ILogger<BillingController> _logger;

        public BillingController(ILogger<BillingController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get billing statistics (alternative endpoint for dashboard stats)
        /// </summary>
        [HttpGet("stats")]
        [ProducesResponseType(typeof(ApiResponse<DashboardStatsDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetBillingStats()
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

                return Ok(ApiResponse<DashboardStatsDto>.SuccessResult(stats, "Billing statistics retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving billing statistics");
                return StatusCode(500, ApiResponse<object>.ErrorResult("Internal server error occurred"));
            }
        }
    }
}
