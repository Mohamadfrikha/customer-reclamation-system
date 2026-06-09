using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Reclamation
    {
        public int ReclamationId { get; set; }

        [Required]
        public DateTime DateReclamation { get; set; } = DateTime.Now;

        [Required]
        [StringLength(1000, MinimumLength = 10)]

        public string Description { get; set; } = string.Empty;
        [Required]
        public StatutReclamation Statut { get; set; } = StatutReclamation.EnAttente;
        [Required]
        public string? ImageGarantie { get; set; } 

        public int ArticleClientId { get; set; }
        public ArticleClient? ArticleClient { get; set; }

        public string UtilisateurId { get; set; }
        public Utilisateur? Utilisateur { get; set; }

        public InterventionTechnique? InterventionTechnique { get; set; }
    }

    public enum StatutReclamation
    {
        EnAttente,  
        Acceptee,  
        Rejetee,   
        Traitee     

    }
}