using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Repositories
{
    public interface IFactureRepositorie
    {
        Task<Facture?> GetByIdAsync(int id);
        Task<Facture?> GetByInterventionIdAsync(int interventionId);
        Task AddAsync(Facture facture);
        Task UpdateAsync(Facture facture);
    }
}
