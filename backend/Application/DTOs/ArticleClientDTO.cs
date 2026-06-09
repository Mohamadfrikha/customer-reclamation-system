using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ArticleClientDTO
    {
        public int ArticleClientId { get; set; }
        public DateTime DateAchat { get; set; }
        public int DureeGarantie { get; set; }
        public DateTime DateFinGarantie { get; set; }
        public bool GarantieActive { get; set; }
        public int JoursRestantsGarantie { get; set; }
        public string StatutGarantie { get; set; }


        // Utilisateur — juste les infos utiles
        public string UtilisateurId { get; set; }
        public string UtilisateurNom { get; set; }
        public string UtilisateurPrenom { get; set; }
        public string UtilisateurEmail { get; set; }
        public string UtilisateurCIN { get; set; }
        public string imageUrl { get; set; }
        public string PhoneNumber { get; set; }

        // Article — informations utiles
        public int ArticleId { get; set; }
        public string ArticleNom { get; set; }
        public string ArticleReference { get; set; }
        public string ArticleImageUrl { get; set; }

        public string ArticleDescription { get; set; }
        public decimal ArticlePrix { get; set; }
        public decimal? ArticlePrixPromo { get; set; }
        public int? ArticleDiscountPercent { get; set; }
        public bool ArticleIsActive { get; set; }

        public int ArticleDureeGarantie { get; set; }


        public int CategorieId { get; set; }
        public string CategorieNom { get; set; }

        // Nombre de réclamations seulement
        public int NombreReclamations { get; set; }

        public ICollection<Reclamation> Reclamations { get; set; } = new List<Reclamation>();
    }
}
