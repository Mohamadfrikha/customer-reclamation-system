using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class UpdateArticle
    {
        public int ArticleId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Nom { get; set; } = string.Empty;
       
        public IFormFile? ImageFile { get; set; }
        [Required]
        public int DureeGarantie { get; set; } // en mois

        [Required]
        [StringLength(500, MinimumLength = 5)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Prix { get; set; }

        [Range(0, 100)]
        public int? DiscountPercent { get; set; }
        [Required]
        public int CategorieId { get; set; }
        public string Reference { get; set; } = string.Empty;
    }
}
