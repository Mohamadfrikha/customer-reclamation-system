using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ReclamationDTO
    {
        public int ReclamationId { get; set; }
        public DateTime DateReclamation { get; set; }
        public string Description { get; set; }
        public string Statut { get; set; }
        public string? ImageGarantie { get; set; }

        // ArticleClient
        public int ArticleClientId { get; set; }
        public string ArticleNom { get; set; }
        public string ArticleReference { get; set; }
        public string ArticleImageUrl { get; set; }

        // Utilisateur
        public string UtilisateurId { get; set; }
        public string UtilisateurNom { get; set; }
        public string UtilisateurPrenom { get; set; }
        public string UtilisateurEmail { get; set; }
        public string UtilisateurCIN { get; set; }
        public string PhoneNumber { get; set; }

        // Intervention
        public bool AIntervention { get; set; }

        public InterventionTechnique? InterventionTechnique { get; set; }
    }
}
