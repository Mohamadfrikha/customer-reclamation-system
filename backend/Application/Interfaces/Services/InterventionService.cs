using Application.DTOs;
using Application.Interfaces.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;

namespace Application.Interfaces.Services
{
    public class InterventionService: IInterventionService
    {
        private readonly IInterventionRepositorie _repo;
        private readonly IReclamationRepositorie _recRep;
        private readonly IFactureRepositorie _factureRepo;      
        private readonly IFacturePdfService _pdfService;

        public InterventionService(IInterventionRepositorie repo, IReclamationRepositorie recRep, IFactureRepositorie factureRepo, IFacturePdfService pdfService)
        {
            _repo = repo;
            _recRep = recRep;
            _factureRepo = factureRepo;
            _pdfService = pdfService;
        }

        private static InterventionDTO ToDTO(InterventionTechnique i) => new()
        {
            InterventionTechniqueId = i.InterventionTechniqueId,
            DateIntervention = i.DateIntervention,
            Description = i.Description,
            CoutMainOeuvre = i.CoutMainOeuvre,
            CoutPieces = i.CoutPieces,
            EstSousGarantie = i.EstSousGarantie,
            EstGratuite = i.EstGratuite,
            ReclamationId = i.ReclamationId,
            ArticleNom = i.Reclamation?.ArticleClient?.Article?.Nom ?? "",
            ArticleReference = i.Reclamation?.ArticleClient?.Article?.Reference ?? "",
            UtilisateurNom = i.Reclamation?.Utilisateur?.LastName ?? "",
            UtilisateurPrenom = i.Reclamation?.Utilisateur?.FirstName ?? "",
            UtilisateurEmail = i.Reclamation?.Utilisateur?.Email ?? "",
            UtilisateurCIN = i.Reclamation?.Utilisateur?.CIN ?? "",
        };

        public async Task<InterventionDTO?> GetByIdAsync(int id)
        {
            var i = await _repo.GetByIdAsync(id);
            return i == null ? null : ToDTO(i);
        }

        public async Task<InterventionDTO?> GetByReclamationIdAsync(int reclamationId)
        {
            var i = await _repo.GetByReclamationIdAsync(reclamationId);
            return i == null ? null : ToDTO(i);
        }

        public async Task<IEnumerable<InterventionDTO>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(ToDTO);
        }

        public async Task<InterventionDTO?> AddAsync(CreateInterventionDTO dto)
        {
            // Vérifier que la réclamation existe et est Acceptee
            var reclamation = await _recRep.GetReclamationByIdAsync(dto.ReclamationId);
            
            if (reclamation == null) return null;
            if (reclamation.Statut != StatutReclamation.Acceptee) return null;

            // Vérifier qu'il n'y a pas déjà une intervention
            var existing = await _repo.GetByReclamationIdAsync(dto.ReclamationId);
            if (existing != null) return null;

            var intervention = new InterventionTechnique
            {
                ReclamationId = dto.ReclamationId,
                Description = dto.Description,
                DateIntervention = DateTime.Now,
                CoutMainOeuvre = dto.CoutMainOeuvre,
                CoutPieces = dto.CoutPieces,
                EstSousGarantie = dto.EstSousGarantie,
            };

            // Logique métier
            intervention.CalculerGratuite();

            await _repo.AddAsync(intervention);


            var facture = new Facture
            {
                InterventionTechniqueId = intervention.InterventionTechniqueId,
                UtilisateurId = reclamation.UtilisateurId,
                CoutMainOeuvre = intervention.CoutMainOeuvre,
                CoutPieces = intervention.CoutPieces,
                DateFacture = DateTime.Now,
            };
            facture.CalculerMontantTotal();
            await _factureRepo.AddAsync(facture);

            // 3 — Générer PDF (après save لأننا نحتاج FactureId)
            var added = await _repo.GetByReclamationIdAsync(dto.ReclamationId);
            facture.InterventionTechnique = added;  
            facture.Utilisateur = reclamation.Utilisateur;
            facture.PdfPath = _pdfService.GenererPdf(facture);
            await _factureRepo.UpdateAsync(facture);

            // Mettre à jour statut → Traitee automatiquement
            reclamation.Statut = StatutReclamation.Traitee;
            await _recRep.UpdateStatutAsync(reclamation.ReclamationId, reclamation.Statut);
            

            return added == null ? null : ToDTO(added);
        }

        public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);
    }
}
