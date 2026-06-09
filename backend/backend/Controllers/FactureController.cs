using Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactureController : ControllerBase
    {
        private readonly IFactureRepositorie _repo;
        public FactureController(IFactureRepositorie repo) => _repo = repo;

        // GET /Facture/intervention/3
        [HttpGet("intervention/{interventionId}")]
        public async Task<IActionResult> GetByIntervention(int interventionId)
        {
            var facture = await _repo.GetByInterventionIdAsync(interventionId);
            if (facture == null) return NotFound();
            return Ok(facture);
        }

        // GET /Facture/5/pdf  → télécharger le PDF
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> TelechargerPdf(int id)
        {
            var facture = await _repo.GetByIdAsync(id);
            if (facture == null || facture.PdfPath == null) return NotFound();

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", facture.PdfPath.TrimStart('/'));
            if (!System.IO.File.Exists(fullPath)) return NotFound();

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(bytes, "application/pdf", $"facture_{id}.pdf");
        }
    }
}
