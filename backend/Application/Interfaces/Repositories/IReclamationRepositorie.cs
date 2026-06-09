using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IReclamationRepositorie
    {
        Task<List<Reclamation>?> GetAllReclamationsAsync();
        Task<Reclamation?> GetReclamationByIdAsync(int id);
        Task<List<Reclamation>?> GetReclamationsByUserIdAsync(string userId);
        Task<List<Reclamation>?> GetReclamationsByArticleClientIdAsync(int articleClientId);
        Task<Reclamation?> AddReclamationAsync(Reclamation reclamation);
        Task<bool> UpdateStatutAsync(int id, StatutReclamation statut);
        Task<bool> DeleteReclamationAsync(int id);

        Task<ArticleClient?> GetByIdAndUserAsync(int articleClientId, string userId);
        Task<Reclamation?> GetByIdRecAndUserAsync(int id, string userId);
    }
}
