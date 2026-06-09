using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class UpdateArticleClientDTO
    {
        public int ArticleId { get; set; }
        
        public int CategorieId { get; set; }
    }
}
