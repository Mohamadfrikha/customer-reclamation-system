using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
namespace Application.Interfaces.Repositories
{
    public interface ICategorieRepositorie
    {
        Task<List<Categorie>> GetAllCategoriesAsync();
        Task<Categorie?> GetCategorieByIdAsync(int id);
        Task<Categorie> AddCategorieAsync(Categorie categorie);
        Task<Categorie?> GetCategorieByName(String Name);

        Task<Categorie?> UpdateCategorieAsync(Categorie categorie);
        Task DeleteCategorieAsync(int id);
    }
}
