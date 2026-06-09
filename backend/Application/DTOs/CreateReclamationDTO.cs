using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CreateReclamationDTO
    {
        [Required]
        [StringLength(500)]
        public string Description { get; set; }
        public IFormFile? ImageGarantie { get; set; }
        [Required]
        public int ArticleClientId { get; set; }
        [Required]
        public string UtilisateurId { get; set; }
    }
}
