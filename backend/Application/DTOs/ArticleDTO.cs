using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ArticleDTO
    {
        public int ArticleId { get; set; }
        
        public string Nom { get; set; } = string.Empty;
     
        public string ImageUrl { get; set; } = string.Empty;
        
        public int DureeGarantie { get; set; } 
        public int CategorieId { get; set; }
        public Categorie? Categorie { get; set; }

        public string Description { get; set; }

        public decimal Prix { get; set; }
      
        public int? DiscountPercent { get; set; }
        public decimal? PrixPromo { get; set; }
        public string? Reference { get; set; }
        public bool IsActive { get; set; }
        public  ICollection<ArticleClient> ArticleClients { get; set; }


    }
}
