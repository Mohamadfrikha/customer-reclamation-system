using Application.DTOs;
using Application.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        public readonly ICategorieService _categorieService;
        public CategoriesController(ICategorieService _categorieService)
        {
            this._categorieService = _categorieService;

        }

        // GET: api/<CategorieController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var result = await _categorieService.GetAllCategoriesAsync();
            return Ok(result);
        }

        // GET api/<CategorieController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var result = await _categorieService.GetCategorieByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        // POST api/<CategorieController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] CreateCategorie categorie)
        {
            if (categorie == null || string.IsNullOrEmpty(categorie.CategorieName))
                return BadRequest("Nom invalide");

            var cat = await _categorieService.GetCategorieByName(categorie.CategorieName);

            if (cat != null)
                return BadRequest("Catégorie existe déjà");

            var result = await _categorieService.AddCategorieAsync(categorie);

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        // PUT api/<CategorieController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateCategorie categorie)
        {
            if (id != categorie.CategorieId)
                return BadRequest("Id mismatch");

            var result = await _categorieService.UpdateCategorieAsync(categorie);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        // DELETE api/<CategorieController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var categorie = await _categorieService.GetCategorieByIdAsync(id);
            if (categorie == null)
                return NotFound();
            await _categorieService.DeleteCategorieAsync(id);
            return Ok();
        }
    }
}
