using Application.DTOs;
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
    public class ArticleClientReposetorie : IArticleClientReposetorie
    {
        private readonly AppDbContext _context;
        public ArticleClientReposetorie(AppDbContext context) {
            _context = context;
        }
        public async Task<ArticleClient?> AddArticleAsync(ArticleClient article)
        {
            await _context.ArticleClients.AddAsync(article);
            await _context.SaveChangesAsync();

            return article;
        }

        public async Task<bool> DeleteArticleAsync(int id)
        {
            var articleClient = await _context.ArticleClients.FindAsync(id);

            if (articleClient == null)
            {
                return false;
            }

            _context.ArticleClients.Remove(articleClient);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<ArticleClient>?> GetAllArticlesAsync()
        {
            return await _context.ArticleClients
                .Include(a => a.Article)
                .Include(a => a.Utilisateur)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ArticleClient?> GetArticleByIdAsync(int id)
        {
            return await _context.ArticleClients
                .Include(a => a.Article)
                .Include(a => a.Utilisateur)
                .Include(a => a.Reclamations)
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.ArticleClientId == id);
        }

        public async Task<List<ArticleClient>?> GetAllArticleClientsByArticleIdAsync(int articleId)
        {
            return await _context.ArticleClients
                .Where(a => a.ArticleId == articleId)   
                .Include(a => a.Utilisateur)
                .Include(a => a.Article)
                .Include(a => a.Reclamations)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<ArticleClient>?> GetAllArticleClientsByUserIdAsync(string userId)
        {
            return await _context.ArticleClients
                .Where(a => a.UtilisateurId == userId)
                .Include(a => a.Utilisateur)
                .Include(a => a.Article)
                .Include(a => a.Reclamations)
                .AsNoTracking()
                .ToListAsync();
        }

        
    }
}
