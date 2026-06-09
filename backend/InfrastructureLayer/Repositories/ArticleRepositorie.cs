using Application.Interfaces.Repositories;
using Domain.Entities;
using GestionSAV.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InfrastructureLayer.Repositories
{
    public class ArticleRepositorie : IArticleRepositorie
    {
        public readonly AppDbContext context;
        public ArticleRepositorie(AppDbContext context) {
        
            this.context = context;
        }
        public async Task<Article> AddArticleAsync(Article article)
        {
            context.Articles.Add(article);
            await context.SaveChangesAsync();
            return article;
        }

        public async Task DeleteArticleAsync(int id)
        {
            var cat = await context.Articles.FindAsync(id);

            if (cat == null)
                return;

            context.Articles.Remove(cat);
            await context.SaveChangesAsync();
        }

        public async Task<List<Article>> GetAllArticlesAsync()
        {
            return await context.Articles
             .Include(c => c.Categorie)
             .Include(c => c.ArticleClients)
             .AsNoTracking()
             .ToListAsync();
        }

        public async Task<Article?> GetArticleByIdAsync(int id)
        {
            return await context.Articles.Include(c => c.Categorie)
             .Include(c => c.ArticleClients)
                .FirstOrDefaultAsync(e => e.ArticleId == id);
        }

        public async Task<Article?> UpdateArticleAsync(Article article)
        {
            var existing = await context.Articles.FindAsync(article.ArticleId);

            if (existing == null)
                return null;

            existing.Nom = article.Nom;
            existing.ImageUrl = article.ImageUrl;
            existing.DureeGarantie = article.DureeGarantie;
            existing.CategorieId = article.CategorieId;
            existing.Description = article.Description;   
            existing.Prix = article.Prix;                 
            existing.Reference = article.Reference;       
            existing.PrixPromo = article.PrixPromo;       
            existing.DiscountPercent = article.DiscountPercent; 
            existing.IsActive = article.IsActive;

            await context.SaveChangesAsync();

            return existing;
        }

        public async Task<List<Article>?> GetDistinctArticlesByUserIdAsync(string userId)
        {
            return await context.ArticleClients
                        .Where(ac => ac.UtilisateurId == userId)
                        .Select(ac => ac.Article)
                        .Where(a => a != null)
                        .Distinct()
                        .Include(a => a.Categorie)       
                        .ToListAsync();
        }
    }
}
