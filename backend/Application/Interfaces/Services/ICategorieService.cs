using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface ICategorieService
    {
        Task<List<CategorieDTO>> GetAllCategoriesAsync();
        Task<CategorieDTO?> GetCategorieByIdAsync(int id);
        Task<Categorie?> GetCategorieByName(String Name);
        Task<CategorieDTO> AddCategorieAsync(CreateCategorie categorie);
        Task<CategorieDTO?> UpdateCategorieAsync(UpdateCategorie categorie);
        Task DeleteCategorieAsync(int id);
    }
}
