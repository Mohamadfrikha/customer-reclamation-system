using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Utilisateur :IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Adresse { get; set; } = string.Empty;

        [Required(ErrorMessage = "CIN est obligatoire")]
        [RegularExpression(@"^\d{8}$", ErrorMessage = "CIN doit contenir exactement 8 chiffres")]
        public string CIN { get; set; } = string.Empty;

        
        public string? ImageUrl { get; set; }

        public bool ForcePasswordChange { get; set; } = false;

        public ICollection<ArticleClient> ArticleClients { get; set; } = new List<ArticleClient>();
        public ICollection<Reclamation> Reclamations { get; set; } = new List<Reclamation>();
        public ICollection<Facture> Factures { get; set; } = new List<Facture>();
    }
}
