using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IArticleRepositorie
    {
        Task<List<Article>> GetAllArticlesAsync();
        Task<Article?> GetArticleByIdAsync(int id);
        Task<Article> AddArticleAsync(Article article);
        Task<Article?> UpdateArticleAsync(Article article);
        Task DeleteArticleAsync(int id);
        Task<List<Article>?> GetDistinctArticlesByUserIdAsync(string userId);
    }
}
