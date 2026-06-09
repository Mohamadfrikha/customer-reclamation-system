using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CreateArticleClientDTO
    {
        [Required]
        public DateTime DateAchat { get; set; }

        [Required]
        public int DureeGarantie { get; set; }
        [Required]
        public string UtilisateurId { get; set; }
        [Required]
        public int ArticleId { get; set; }

    }
}
