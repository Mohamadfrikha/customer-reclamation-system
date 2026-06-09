using Application.DTOs;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleClientController : ControllerBase
    {

        private readonly IArticleClientService _articleClientService;

        public ArticleClientController(IArticleClientService articleClientService)
        {
            _articleClientService = articleClientService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var articles = await _articleClientService.GetAllArticlesAsync();

            return Ok(articles);
        }
        [HttpGet("{id}")]
        
        public async Task<IActionResult> GetById(int id)
        {
            var article = await _articleClientService.GetArticleByIdAsync(id);

            if (article == null)
            {
                return NotFound();
            }

            return Ok(article);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateArticleClientDTO article)
        {
            var result = await _articleClientService.AddArticleAsync(article);

            if (result == null)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _articleClientService.DeleteArticleAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return Ok(new
            {
                message = "Article supprimé avec succès"
            });
        }

        [HttpGet("byArticle/{articleId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByArticleId(int articleId)
        {
            var result = await _articleClientService.GetAllArticleClientsByArticleIdAsync(articleId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("myArticles")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetMyArticles()
        {
            var userId = User.FindFirst("uid")?.Value;
            var result = await _articleClientService.GetAllArticleClientsByUserIdAsync(userId);
            if (result == null) return NotFound();
            return Ok(result);
        }


    }
}
