using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class InterventionDTO
    {
        public int InterventionTechniqueId { get; set; }
        public DateTime DateIntervention { get; set; }
        public string Description { get; set; } = string.Empty;
        public double CoutMainOeuvre { get; set; }
        public double CoutPieces { get; set; }
        public bool EstSousGarantie { get; set; }
        public bool EstGratuite { get; set; }
        public int ReclamationId { get; set; }
        public string ArticleNom { get; set; } = string.Empty;
        public string ArticleReference { get; set; } = string.Empty;
        public string UtilisateurNom { get; set; } = string.Empty;
        public string UtilisateurPrenom { get; set; } = string.Empty;
        public string UtilisateurEmail { get; set; } = string.Empty;
        public string UtilisateurCIN { get; set; } = string.Empty;

    }
}
