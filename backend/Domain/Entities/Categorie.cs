using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Categorie
    {
        public int CategorieId { get; set; }
        [Required]
        public string CategorieName { get; set; }

        // Navigation
        public ICollection<Article> Articles { get; set; } = new List<Article>();
        
    }
}
