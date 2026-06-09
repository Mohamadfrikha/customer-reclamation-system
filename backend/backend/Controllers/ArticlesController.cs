using Application.DTOs;
using Application.Interfaces.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        public readonly IArticleService _articleService;
        public ArticlesController(IArticleService _articleService) {
        
            this._articleService = _articleService;
        }
        
        // GET: api/<ArticlesController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var result = await _articleService.GetAllArticlesAsync();
            return Ok(result);
        }

        // GET api/<ArticlesController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var result = await _articleService.GetArticleByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        // POST api/<ArticlesController>
        [HttpPost]
        public async Task<ActionResult> Post([FromForm] CreateArticle article)
        {
            
            var result = await _articleService.AddArticleAsync(article);

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        // PUT api/<ArticlesController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] UpdateArticle article)
        {
            if (id != article.ArticleId)
                return BadRequest("Id mismatch");

            var result = await _articleService.UpdateArticleAsync(article);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        // DELETE api/<ArticlesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var categorie = await _articleService.GetArticleByIdAsync(id);
            if (categorie == null)
                return NotFound();
            await _articleService.DeleteArticleAsync(id);
            return Ok();
        }

        [HttpGet("myArticles")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetMyArticles()
        {
            var userId = User.FindFirst("uid")?.Value;
            var result = await _articleService.GetDistinctArticlesByUserIdAsync(userId);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
