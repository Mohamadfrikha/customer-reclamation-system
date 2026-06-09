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
    public class FactureRepositorie: IFactureRepositorie
    {
        private readonly AppDbContext _context;
        public FactureRepositorie(AppDbContext context) => _context = context;

        public async Task<Facture?> GetByIdAsync(int id) =>
            await _context.Factures
                .Include(f => f.InterventionTechnique)
                .Include(f => f.Utilisateur)
                .FirstOrDefaultAsync(f => f.FactureId == id);

        public async Task<Facture?> GetByInterventionIdAsync(int interventionId) =>
            await _context.Factures
                .Include(f => f.InterventionTechnique)
                .Include(f => f.Utilisateur)
                .FirstOrDefaultAsync(f => f.InterventionTechniqueId == interventionId);

        public async Task AddAsync(Facture facture)
        {
            await _context.Factures.AddAsync(facture);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Facture facture)
        {
            _context.Factures.Update(facture);
            await _context.SaveChangesAsync();
        }
    }
}
