using Application.DTOs;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public class ReclamationService :IReclamationService
    {
        private readonly IReclamationRepositorie _repo;

        public ReclamationService(IReclamationRepositorie repo)
        {
            _repo = repo;
        }

        public ReclamationDTO MapDTO(Reclamation r)
        {
            return new ReclamationDTO
            {
                ReclamationId = r.ReclamationId,
                DateReclamation = r.DateReclamation,
                Description = r.Description,
                Statut = r.Statut.ToString(),
                ImageGarantie = r.ImageGarantie,
                ArticleClientId = r.ArticleClientId,
                ArticleNom = r.ArticleClient?.Article?.Nom,
                ArticleReference = r.ArticleClient?.Article?.Reference,
                ArticleImageUrl = r.ArticleClient?.Article?.ImageUrl,
                UtilisateurId = r.UtilisateurId,
                UtilisateurNom = r.Utilisateur?.LastName,
                UtilisateurPrenom = r.Utilisateur?.FirstName,
                UtilisateurEmail = r.Utilisateur?.Email,
                UtilisateurCIN = r.Utilisateur?.CIN,
                AIntervention = r.InterventionTechnique != null,
                PhoneNumber= r.Utilisateur?.PhoneNumber,
                InterventionTechnique=r.InterventionTechnique
            };
        }

        public async Task<List<ReclamationDTO>?> GetAllReclamationsAsync()
        {
            var result = await _repo.GetAllReclamationsAsync();
            return result?.Select(r => MapDTO(r)).ToList();
        }

        public async Task<ReclamationDTO?> GetReclamationByIdAsync(int id)
        {
            var result = await _repo.GetReclamationByIdAsync(id);
            return result == null ? null : MapDTO(result);
        }

        public async Task<List<ReclamationDTO>?> GetReclamationsByUserIdAsync(string userId)
        {
            var result = await _repo.GetReclamationsByUserIdAsync(userId);
            return result?.Select(r => MapDTO(r)).ToList();
        }

        public async Task<List<ReclamationDTO>?> GetReclamationsByArticleClientIdAsync(int articleClientId)
        {
            var result = await _repo.GetReclamationsByArticleClientIdAsync(articleClientId);
            return result?.Select(r => MapDTO(r)).ToList();
        }

        public async Task<string> SaveImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return "/images/" + fileName;
        }

        public async Task<ReclamationDTO?> AddReclamationAsync(CreateReclamationDTO dto)
        {
            var imageUrl = await SaveImage(dto.ImageGarantie);
            var reclamation = new Reclamation
            {
                Description = dto.Description,
                ImageGarantie = imageUrl,
                ArticleClientId = dto.ArticleClientId,
                UtilisateurId = dto.UtilisateurId
            };
            var result = await _repo.AddReclamationAsync(reclamation);
            return result == null ? null : MapDTO(result);
        }

        public async Task<bool> UpdateStatutAsync(int id, StatutReclamation statut)
        {
            return await _repo.UpdateStatutAsync(id, statut);
        }

        public async Task<bool> DeleteReclamationAsync(int id)
        {
            return await _repo.DeleteReclamationAsync(id);
        }
        public async Task<ArticleClient?> GetByIdAndUserAsync(int articleClientId, string userId)
        {
            return await _repo.GetByIdAndUserAsync(articleClientId, userId);
        }

        public async Task<Reclamation?> GetByIdRecAndUserAsync(int id, string userId)
        {
            return await _repo.GetByIdRecAndUserAsync(id, userId);
        }
    }
}
