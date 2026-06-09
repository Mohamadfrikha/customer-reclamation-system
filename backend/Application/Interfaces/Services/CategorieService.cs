using Application.DTOs;
using Application.Interfaces.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public class CategorieService : ICategorieService
    {
        private readonly ICategorieRepositorie _categorieRepositorie;
        public CategorieService(ICategorieRepositorie _categorieRepositorie) 
        {
            this._categorieRepositorie = _categorieRepositorie;

        }

        public CategorieDTO ConvertToDTO(Categorie categorie)
        {
            return new CategorieDTO
            {
                Id = categorie.CategorieId,
                CategorieName = categorie.CategorieName,
                Articles = categorie.Articles
            };
        }

        
        public async Task<CategorieDTO> AddCategorieAsync(CreateCategorie categorie)
        {

            var categorieAdd =await _categorieRepositorie.AddCategorieAsync(new Categorie
            {
                CategorieName = categorie.CategorieName
            });
            return ConvertToDTO(categorieAdd);
        }

        

        public async Task DeleteCategorieAsync(int id)
        {
            await _categorieRepositorie.DeleteCategorieAsync(id);
        }

        public async Task<List<CategorieDTO>> GetAllCategoriesAsync()
        {
            var categories = await _categorieRepositorie.GetAllCategoriesAsync();

            return categories.Select(c => ConvertToDTO(c)).ToList();
        }

        public async Task<CategorieDTO?> GetCategorieByIdAsync(int id)
        {
            var result = await _categorieRepositorie.GetCategorieByIdAsync(id);
            if(result!=null)
                return ConvertToDTO(result);
            return null;
        }

        public async Task<CategorieDTO?> UpdateCategorieAsync(UpdateCategorie categorie)
        {

            var result = await _categorieRepositorie.UpdateCategorieAsync(new Categorie
            {
                CategorieId = categorie.CategorieId,
                CategorieName = categorie.CategorieName
            });

            if (result == null)
                return null;

            return ConvertToDTO(result);
        }

        public async Task<Categorie?> GetCategorieByName(string Name)
        {
            return await _categorieRepositorie.GetCategorieByName(Name);
        }
    }
}
