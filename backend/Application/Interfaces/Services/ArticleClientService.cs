using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
namespace Application.Interfaces.Services
{
    public class ArticleClientService : IArticleClientService
    {
        private readonly IArticleClientReposetorie _articleClient;
        public ArticleClientService(IArticleClientReposetorie articleClient)
        {
            _articleClient = articleClient;
        }

        public ArticleClientDTO MapTDO(ArticleClient articleClient)
        {
            return new ArticleClientDTO
            {
                ArticleClientId = articleClient.ArticleClientId,
                DateAchat = articleClient.DateAchat,
                DureeGarantie = articleClient.DureeGarantie,


                DateFinGarantie = articleClient.DateAchat.AddYears(articleClient.DureeGarantie),
                GarantieActive = DateTime.Now <= articleClient.DateAchat.AddYears(articleClient.DureeGarantie),
                JoursRestantsGarantie = DateTime.Now <= articleClient.DateAchat.AddYears(articleClient.DureeGarantie)
                ? (articleClient.DateAchat.AddYears(articleClient.DureeGarantie) - DateTime.Now).Days
                : 0,
                StatutGarantie = DateTime.Now <= articleClient.DateAchat.AddYears(articleClient.DureeGarantie)
                ? $"Active ({(articleClient.DateAchat.AddYears(articleClient.DureeGarantie) - DateTime.Now).Days} jours restants)"
                : "Expirée",


                UtilisateurId = articleClient.UtilisateurId,
                UtilisateurNom = articleClient.Utilisateur?.LastName,
                UtilisateurPrenom = articleClient.Utilisateur?.FirstName,
                UtilisateurEmail = articleClient.Utilisateur?.Email,
                UtilisateurCIN = articleClient.Utilisateur?.CIN,
                imageUrl = articleClient.Utilisateur?.ImageUrl,
                PhoneNumber = articleClient.Utilisateur?.PhoneNumber,

                ArticleId = articleClient.ArticleId,
                ArticleNom = articleClient.Article?.Nom,
                ArticleReference = articleClient.Article?.Reference,
                ArticleImageUrl = articleClient.Article?.ImageUrl,

                ArticleDescription = articleClient.Article?.Description,
                ArticlePrix = articleClient.Article?.Prix ?? 0,
                ArticlePrixPromo = articleClient.Article?.PrixPromo,
                ArticleDiscountPercent = articleClient.Article?.DiscountPercent,
                ArticleIsActive = articleClient.Article?.IsActive ?? false,
                ArticleDureeGarantie = articleClient.Article?.DureeGarantie ?? 0,

                CategorieId = articleClient.Article?.CategorieId ?? 0,
                CategorieNom = articleClient.Article?.Categorie?.CategorieName,

                NombreReclamations = articleClient.Reclamations?.Count ?? 0,

                //Utilisateur = articleClient.Utilisateur,
                //Article = articleClient.Article,
                Reclamations = articleClient.Reclamations
            };
        }
        public async Task<ArticleClientDTO?> AddArticleAsync(CreateArticleClientDTO article)
        {
            var articleClient = new ArticleClient
            {
                DateAchat = article.DateAchat,
                DureeGarantie = article.DureeGarantie,
                UtilisateurId = article.UtilisateurId,
                ArticleId = article.ArticleId
            };

            var result = await _articleClient.AddArticleAsync(articleClient);

            if (result == null)
            {
                return null;
            }

            return MapTDO(result);
        }

        public async Task<bool> DeleteArticleAsync(int id)
        {
            return await _articleClient.DeleteArticleAsync(id);
        }

        public async Task<List<ArticleClientDTO>?> GetAllArticlesAsync()
        {
            var articles = await _articleClient.GetAllArticlesAsync();

            if (articles == null)
            {
                return null;
            }

            return articles.Select(a => MapTDO(a)).ToList();
        }

        public async Task<ArticleClientDTO?> GetArticleByIdAsync(int id)
        {
            var article = await _articleClient.GetArticleByIdAsync(id);

            if (article == null)
            {
                return null;
            }

            return MapTDO(article);
        }

        public async Task<List<ArticleClientDTO>?> GetAllArticleClientsByArticleIdAsync(int articleId)
        {
            var articles = await _articleClient.GetAllArticleClientsByArticleIdAsync(articleId);
            if (articles == null) return null;
            return articles.Select(a => MapTDO(a)).ToList();
        }


        public async Task<List<ArticleClientDTO>?> GetAllArticleClientsByUserIdAsync(string userId)
        {
            var articles = await _articleClient.GetAllArticleClientsByUserIdAsync(userId);
            if (articles == null) return null;
            return articles.Select(a => MapTDO(a)).ToList();
        }

        
    }
}
