using Application.Interfaces.Repositories;
using Domain.Entities;
using GestionSAV.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfrastructureLayer.Repositories
{
    public class ReclamationRepositorie :IReclamationRepositorie
    {
        private readonly AppDbContext _context;

        public ReclamationRepositorie(AppDbContext context)
        {
            _context = context;
        }

        private IQueryable<Reclamation> GetWithIncludes()
        {
            return _context.Reclamations
                .Include(r => r.Utilisateur)
                .Include(r => r.ArticleClient)
                    .ThenInclude(ac => ac.Article)
                .Include(r => r.InterventionTechnique)
                    .ThenInclude(i => i.Facture);
        }

        public async Task<List<Reclamation>?> GetAllReclamationsAsync()
        {
            return await GetWithIncludes().OrderByDescending(r => r.DateReclamation).ToListAsync();
        }

        public async Task<Reclamation?> GetReclamationByIdAsync(int id)
        {
            return await GetWithIncludes()
                .FirstOrDefaultAsync(r => r.ReclamationId == id);
        }

        public async Task<List<Reclamation>?> GetReclamationsByUserIdAsync(string userId)
        {
            return await GetWithIncludes().OrderByDescending(r => r.DateReclamation)
                .Where(r => r.UtilisateurId == userId)
                .ToListAsync();
        }

        public async Task<List<Reclamation>?> GetReclamationsByArticleClientIdAsync(int articleClientId)
        {
            return await GetWithIncludes()
                .OrderByDescending(r => r.DateReclamation)
                .Where(r => r.ArticleClientId == articleClientId)
                .ToListAsync();
        }

        public async Task<Reclamation?> AddReclamationAsync(Reclamation reclamation)
        {
            await _context.Reclamations.AddAsync(reclamation);
            await _context.SaveChangesAsync();
            return await GetReclamationByIdAsync(reclamation.ReclamationId);
        }

        public async Task<bool> UpdateStatutAsync(int id, StatutReclamation statut)
        {
            var reclamation = await _context.Reclamations.FindAsync(id);
            if (reclamation == null) return false;
            reclamation.Statut = statut;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteReclamationAsync(int id)
        {
            var reclamation = await _context.Reclamations.FindAsync(id);
            if (reclamation == null) return false;
            _context.Reclamations.Remove(reclamation);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ArticleClient?> GetByIdAndUserAsync(int articleClientId, string userId)
        {
            return await _context.ArticleClients
                .FirstOrDefaultAsync(a => a.ArticleClientId == articleClientId && a.UtilisateurId == userId);
        }

        public async Task<Reclamation?> GetByIdRecAndUserAsync(int id, string userId)
        {
            return await _context.Reclamations
                .FirstOrDefaultAsync(r => r.ReclamationId == id && r.UtilisateurId == userId);
        }


    }
}
