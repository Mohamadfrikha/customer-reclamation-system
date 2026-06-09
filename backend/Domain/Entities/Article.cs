using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Article
    {
        public int ArticleId { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Nom { get; set; } = string.Empty;
        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        [Required]
        public int DureeGarantie { get; set; } // en mois

        // FK
        public int CategorieId { get; set; }
        public Categorie? Categorie { get; set; }

        [Required]
        [StringLength(500, MinimumLength = 5)]
        public string Description { get; set; } = string.Empty;
        [Required]
        public string? Reference { get; set; }
        [Range(0.01, double.MaxValue)]
        public decimal Prix { get; set; }
        
        public decimal? PrixPromo { get; set; }
        public bool IsActive { get; set; } = true;


        [Range(0, 100)]
        public int? DiscountPercent { get; set; }

        // Navigation
        public ICollection<ArticleClient> ArticleClients { get; set; } = new List<ArticleClient>();
    }
}
