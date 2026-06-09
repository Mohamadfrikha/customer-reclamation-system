using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces.Repositories;
using Domain.Entities;
using GestionSAV.Data;
using Microsoft.EntityFrameworkCore;
namespace InfrastructureLayer.Repositories
{
    public class CategorieRepositorie : ICategorieRepositorie
    {
        private readonly AppDbContext context; 
        public CategorieRepositorie(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<Categorie> AddCategorieAsync(Categorie categorie)
        {
            context.Categories.Add(categorie);
            await context.SaveChangesAsync();
            return categorie;
        }

        public async Task DeleteCategorieAsync(int id)
        {
            var cat = await context.Categories.FindAsync(id);

            if (cat == null)
                return;

            context.Categories.Remove(cat);
            await context.SaveChangesAsync();
        }

        public async Task<List<Categorie>> GetAllCategoriesAsync()
        {
            return await context.Categories.Include(c=>c.Articles)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Categorie?> GetCategorieByIdAsync(int id)
        {
            return await context.Categories.Include(c => c.Articles)
                .FirstOrDefaultAsync(e => e.CategorieId == id);
        }

        public async Task<Categorie?> GetCategorieByName(string Name)
        {
            return await context.Categories.Include(c => c.Articles).FirstOrDefaultAsync(e => e.CategorieName == Name);
        }

        public async Task<Categorie?> UpdateCategorieAsync(Categorie categorie)
        {
            var existing = await context.Categories.FindAsync(categorie.CategorieId);

            if (existing == null)
                return null;

            existing.CategorieName = categorie.CategorieName;

            await context.SaveChangesAsync();

            return existing;
        }
    }
}
