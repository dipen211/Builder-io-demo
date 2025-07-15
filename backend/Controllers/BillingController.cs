using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class BillingController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<BillingController> _logger;

        public BillingController(IDashboardService dashboardService, ILogger<BillingController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        /// <summary>
        /// Get billing statistics (alternative endpoint for dashboard stats)
        /// </summary>
        /// <returns>Billing statistics</returns>
        [HttpGet("stats")]
        [ProducesResponseType(typeof(ApiResponse<DashboardStatsDto>), 200)]
        [ProducesResponseType(typeof(ApiResponse<object>), 500)]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetBillingStats()
        {
            try
            {
                var stats = await _dashboardService.GetDashboardStatsAsync();
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
