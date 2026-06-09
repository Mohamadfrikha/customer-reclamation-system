using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
namespace Application.Interfaces.Services
{
    public interface IReclamationService
    {
        Task<List<ReclamationDTO>?> GetAllReclamationsAsync();
        Task<ReclamationDTO?> GetReclamationByIdAsync(int id);
        Task<List<ReclamationDTO>?> GetReclamationsByUserIdAsync(string userId);
        Task<List<ReclamationDTO>?> GetReclamationsByArticleClientIdAsync(int articleClientId);
        Task<ReclamationDTO?> AddReclamationAsync(CreateReclamationDTO reclamation);
        Task<bool> UpdateStatutAsync(int id, StatutReclamation statut);
        Task<bool> DeleteReclamationAsync(int id);
        Task<ArticleClient?> GetByIdAndUserAsync(int articleClientId, string userId);

        Task<Reclamation?> GetByIdRecAndUserAsync(int id, string userId);
    }
}
