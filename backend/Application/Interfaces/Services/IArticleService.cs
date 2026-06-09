using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IArticleService
    {
        Task<List<ArticleDTO>> GetAllArticlesAsync();
        Task<ArticleDTO?> GetArticleByIdAsync(int id);
        Task<ArticleDTO> AddArticleAsync(CreateArticle article);
        Task<ArticleDTO?> UpdateArticleAsync(UpdateArticle article);
        Task DeleteArticleAsync(int id);

        Task<List<ArticleDTO>?> GetDistinctArticlesByUserIdAsync(string userId);

    }
}
