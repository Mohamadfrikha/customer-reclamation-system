using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IArticleClientService
    {
        Task<List<ArticleClientDTO>?> GetAllArticlesAsync();
        Task<ArticleClientDTO?> GetArticleByIdAsync(int id);
        Task<ArticleClientDTO?> AddArticleAsync(CreateArticleClientDTO article);
        //Task<ArticleClient> UpdateArticleAsync(UpdateArticleClient article);
        Task<bool> DeleteArticleAsync(int id);

        Task<List<ArticleClientDTO>?> GetAllArticleClientsByArticleIdAsync(int articleId);
        Task<List<ArticleClientDTO>?> GetAllArticleClientsByUserIdAsync(string userId);

        
    }
}
