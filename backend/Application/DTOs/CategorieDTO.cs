using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CategorieDTO
    {
        public int Id { get; set; }
        public string CategorieName { get; set; } = string.Empty;

        public ICollection<Article> Articles { get; set; } = new List<Article>();

    }
}
