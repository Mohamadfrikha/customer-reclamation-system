using Domain.Entities;
using GestionSAV.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InfrastructureLayer.Repositories
{
    public class InterventionRepositorie: IInterventionRepositorie
    {
        private readonly AppDbContext _context;

        public InterventionRepositorie(AppDbContext context)
        {
            _context = context;
        }

        public async Task<InterventionTechnique?> GetByIdAsync(int id)
        {
            return await _context.InterventionsTechniques
                .Include(i => i.Reclamation)
                    .ThenInclude(r => r.Utilisateur)
                .Include(i => i.Reclamation)
                    .ThenInclude(r => r.ArticleClient)
                        .ThenInclude(a => a.Article)
                .Include(i => i.Facture)
                .FirstOrDefaultAsync(i => i.InterventionTechniqueId == id);
        }

        public async Task<InterventionTechnique?> GetByReclamationIdAsync(int reclamationId)
        {
            return await _context.InterventionsTechniques
                .Include(i => i.Reclamation)
                    .ThenInclude(r => r.Utilisateur)
                .Include(i => i.Reclamation)
                    .ThenInclude(r => r.ArticleClient)
                        .ThenInclude(a => a.Article)
                .Include(i => i.Facture)
                .FirstOrDefaultAsync(i => i.ReclamationId == reclamationId);
        }

        public async Task<IEnumerable<InterventionTechnique>> GetAllAsync()
        {
            return await _context.InterventionsTechniques
                .Include(i => i.Reclamation)
                    .ThenInclude(r => r.Utilisateur)
                .Include(i => i.Reclamation)
                    .ThenInclude(r => r.ArticleClient)
                        .ThenInclude(a => a.Article)
                .Include(i => i.Facture)
                .ToListAsync();
        }

        public async Task<InterventionTechnique> AddAsync(InterventionTechnique intervention)
        {
            _context.InterventionsTechniques.Add(intervention);
            await _context.SaveChangesAsync();
            return intervention;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var intervention = await _context.InterventionsTechniques.FindAsync(id);
            if (intervention == null) return false;
            _context.InterventionsTechniques.Remove(intervention);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
