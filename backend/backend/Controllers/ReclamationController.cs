using Application.DTOs;
using Application.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReclamationController : ControllerBase
    {
        private readonly IReclamationService _service;

        public ReclamationController(IReclamationService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllReclamationsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetReclamationByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("myReclamations")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetMyReclamations()
        {
            var userId = User.FindFirst("uid")?.Value;
            var result = await _service.GetReclamationsByUserIdAsync(userId);
            return Ok(result);
        }

        [HttpGet("byArticleClient/{articleClientId}")]
        public async Task<IActionResult> GetByArticleClient(int articleClientId)
        {
            var result = await _service.GetReclamationsByArticleClientIdAsync(articleClientId);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> Add([FromForm] CreateReclamationDTO dto)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (userId == null) return Unauthorized();

            // Vérifier que l'articleClient appartient bien à cet utilisateur
            var articleClient = await _service.GetByIdAndUserAsync(dto.ArticleClientId, userId);

            if (articleClient == null) return Forbid();
            var result = await _service.AddReclamationAsync(dto);
            if (result == null) return BadRequest();
            return Ok(result);
        }

        [HttpPut("statut/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatut(int id, [FromBody] UpdateStatutDTO dto)
        {
            var reclamation = await _service.GetReclamationByIdAsync(id);
            if (reclamation == null) return NotFound();

            // Parser le statut string → enum
            if (!Enum.TryParse<StatutReclamation>(reclamation.Statut, out var statutActuel))
                return BadRequest("Statut actuel invalide.");

            var allowedTransitions = new Dictionary<StatutReclamation, List<StatutReclamation>>
            {
                { StatutReclamation.EnAttente, new List<StatutReclamation> { StatutReclamation.Acceptee, StatutReclamation.Rejetee } },
                { StatutReclamation.Acceptee,  new List<StatutReclamation> { StatutReclamation.Traitee,  StatutReclamation.Rejetee } },
                { StatutReclamation.Rejetee,   new List<StatutReclamation>() },
                { StatutReclamation.Traitee,   new List<StatutReclamation>() },
            };

            if (!allowedTransitions[statutActuel].Contains(dto.Statut))
                return BadRequest($"Transition invalide : {statutActuel} → {dto.Statut}");

            var result = await _service.UpdateStatutAsync(id, dto.Statut);
            if (!result) return BadRequest();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst("uid")?.Value;
            if (userId == null) return Unauthorized();

            var reclamation = await _service.GetByIdRecAndUserAsync(id, userId);
            if (reclamation == null) return Forbid();

            if (reclamation.Statut != StatutReclamation.EnAttente)
                return BadRequest("Impossible de supprimer une réclamation déjà traitée.");
            var result = await _service.DeleteReclamationAsync(id);
            if (!result) return NotFound();
            return Ok();
        }
    }
}
