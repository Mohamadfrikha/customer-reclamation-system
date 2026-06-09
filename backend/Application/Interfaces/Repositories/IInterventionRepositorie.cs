using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IInterventionRepositorie
    {
        Task<InterventionTechnique?> GetByIdAsync(int id);
        Task<InterventionTechnique?> GetByReclamationIdAsync(int reclamationId);
        Task<IEnumerable<InterventionTechnique>> GetAllAsync();
        Task<InterventionTechnique> AddAsync(InterventionTechnique intervention);
        Task<bool> DeleteAsync(int id);
    }
}
