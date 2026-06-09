using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IInterventionService
    {
        Task<InterventionDTO?> GetByIdAsync(int id);
        Task<InterventionDTO?> GetByReclamationIdAsync(int reclamationId);
        Task<IEnumerable<InterventionDTO>> GetAllAsync();
        Task<InterventionDTO?> AddAsync(CreateInterventionDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
