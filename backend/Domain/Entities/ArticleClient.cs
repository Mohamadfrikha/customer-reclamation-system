using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class ArticleClient
    {
        public int ArticleClientId { get; set; }
        [Required]
        public DateTime DateAchat { get; set; }
        [Required]
        public int DureeGarantie { get; set; } // en mois (copié depuis Article au moment de l'achat)

        // FK
        public string UtilisateurId { get; set; }
        public Utilisateur? Utilisateur { get; set; }

        public int ArticleId { get; set; }
        public Article? Article { get; set; }

        // Navigation
        public ICollection<Reclamation> Reclamations { get; set; } = new List<Reclamation>();

        // Méthode métier
        public bool EstSousGarantie()
        {
            return DateTime.Now <= DateAchat.AddYears(DureeGarantie);
        }
    }
}
