using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Facture
    {
        public int FactureId { get; set; }
        public DateTime DateFacture { get; set; } = DateTime.Now;
        [Required]
        public double CoutMainOeuvre { get; set; }
        [Required]
        public double CoutPieces { get; set; }
        public double MontantTotal { get; set; }

        public string? PdfPath { get; set; }
        public int InterventionTechniqueId { get; set; }
        public InterventionTechnique? InterventionTechnique { get; set; }

        public string UtilisateurId { get; set; }
        public Utilisateur Utilisateur { get; set; }

        // Méthode métier
        public void CalculerMontantTotal()
        {
            MontantTotal = CoutMainOeuvre + CoutPieces;
        }
    }
}
