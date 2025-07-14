using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly IBillingService _billingService;

        public InvoicesController(IBillingService billingService)
        {
            _billingService = billingService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Invoice>>> GetInvoices()
        {
            var invoices = await _billingService.GetInvoicesAsync();
            return Ok(invoices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            var invoice = await _billingService.GetInvoiceAsync(id);
            if (invoice == null)
                return NotFound();

            return Ok(invoice);
        }

        [HttpPost]
        public async Task<ActionResult<Invoice>> CreateInvoice(CreateInvoiceRequest request)
        {
            try
            {
                var invoice = await _billingService.CreateInvoiceAsync(request);
                return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
