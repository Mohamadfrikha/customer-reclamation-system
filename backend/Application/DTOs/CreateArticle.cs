using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class CreateArticle
    {
       
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Nom { get; set; } = string.Empty;
        [Required]
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
     
        public int CategorieId { get; set; }
        
        [Required]
        public string Reference { get; set; } = string.Empty;


    }
}
