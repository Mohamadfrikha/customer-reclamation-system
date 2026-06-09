using Application.DTOs;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public class ArticleService : IArticleService
    {
        public readonly IArticleRepositorie _articleRepositorie;
        public ArticleService(IArticleRepositorie _articleRepositorie)
        {

            this._articleRepositorie = _articleRepositorie;
        }
        public ArticleDTO ConvertToDTO(Article article)
        {
            return new ArticleDTO
            {
                ArticleId = article.ArticleId,
                Nom=article.Nom,
                ImageUrl=article.ImageUrl,
                DureeGarantie=article.DureeGarantie,
                CategorieId=article.CategorieId,
                Categorie=article.Categorie,
                ArticleClients=article.ArticleClients,
                Description = article.Description,
                Prix=article.Prix,
                PrixPromo=article.PrixPromo,
                Reference=article.Reference,
                IsActive=article.IsActive,
                DiscountPercent=article.DiscountPercent
            };
        }

        public async Task<string> SaveImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return "/images/" + fileName;
        }
        public async Task<ArticleDTO> AddArticleAsync(CreateArticle article)
        {
            var imageUrl = await SaveImage(article.ImageFile);
            decimal? prixPromo = null;

            if (article.DiscountPercent.HasValue && article.DiscountPercent > 0)
            {
                prixPromo = article.Prix * (1 - article.DiscountPercent.Value / 100m);
            }
            var articleAdd = await _articleRepositorie.AddArticleAsync(new Article
            {
                Nom = article.Nom,
                ImageUrl = imageUrl,
                DureeGarantie = article.DureeGarantie,
                CategorieId = article.CategorieId,
                Description = article.Description,
                DiscountPercent = article.DiscountPercent,
                Prix = article.Prix,
                Reference = article.Reference,
                PrixPromo= prixPromo,
                IsActive = true
            });    

            return ConvertToDTO(articleAdd);
        }

        public async Task DeleteArticleAsync(int id)
        {
            await _articleRepositorie.DeleteArticleAsync(id);
        }

        public async Task<List<ArticleDTO>> GetAllArticlesAsync()
        {
            var articles = await _articleRepositorie.GetAllArticlesAsync();

            return articles.Select(a => ConvertToDTO(a)).ToList();
        }

        public async Task<ArticleDTO?> GetArticleByIdAsync(int id)
        {
            var result = await _articleRepositorie.GetArticleByIdAsync(id);
            if (result != null)
                return ConvertToDTO(result);
            return null;
        }

        public async Task<ArticleDTO?> UpdateArticleAsync(UpdateArticle article)
        {
            
            var existing = await _articleRepositorie.GetArticleByIdAsync(article.ArticleId);
            if (existing == null) return null;

            decimal? prixPromo = null;

            if (article.DiscountPercent.HasValue && article.DiscountPercent > 0)
            {
                prixPromo = article.Prix * (1 - article.DiscountPercent.Value / 100m);
            }

            var imageUrl = article.ImageFile != null
                ? await SaveImage(article.ImageFile)
                : existing.ImageUrl;  

            var result = await _articleRepositorie.UpdateArticleAsync(new Article
            {
                ArticleId = article.ArticleId,
                Nom = article.Nom,
                ImageUrl = imageUrl,
                DureeGarantie = article.DureeGarantie,
                CategorieId = article.CategorieId,
                Description = article.Description,
                Prix = article.Prix,
                Reference = article.Reference,
                PrixPromo = prixPromo,
                DiscountPercent = article.DiscountPercent
            });

            if (result == null) return null;
            return ConvertToDTO(result);
        }

        public async Task<List<ArticleDTO>?> GetDistinctArticlesByUserIdAsync(string userId)
        {
            var articles = await _articleRepositorie.GetDistinctArticlesByUserIdAsync(userId);
            if (articles == null) return null;
            return articles.Select(a => ConvertToDTO(a)).ToList();
        }


    }
}
