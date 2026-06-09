using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IArticleClientReposetorie
    {
            Task<List<ArticleClient>?> GetAllArticlesAsync();
            Task<ArticleClient?> GetArticleByIdAsync(int id);
            Task<ArticleClient?> AddArticleAsync(ArticleClient article);
            //Task<ArticleClient> UpdateArticleAsync(UpdateArticleClient article);
            Task<bool> DeleteArticleAsync(int id);

        Task<List<ArticleClient>?> GetAllArticleClientsByArticleIdAsync(int articleId);
        Task<List<ArticleClient>?> GetAllArticleClientsByUserIdAsync(string userId);

        
    }
}
