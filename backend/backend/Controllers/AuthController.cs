using Application.DTOs;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _authService.GetAllUsers();
            return Ok(users);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.RegisterAsync(model);
            if (!result.IsAuthenticated)
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("token")]
        public async Task<IActionResult> GetTokenAsync([FromBody] TokenRequestDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.GetTokenAsync(model);

            if (!result.IsAuthenticated && result.Message == "PASSWORD_CHANGE_REQUIRED")
                return StatusCode(403, new { result.Message, result.Email });

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPost("addrole")]
        public async Task<IActionResult> AddRoleAsync([FromBody] AddUserInRoleDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.AddRoleAsync(model);

            if (!string.IsNullOrEmpty(result))
                return BadRequest(result);

            return Ok(model);
        }

        [HttpGet("byCin/{cin}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserByCIN(string cin)
        {
            var user = await _authService.GetUserByCIN(cin);
            if (user is null)
                return NotFound("Aucun client trouvé avec ce CIN");
            return Ok(user);
        }

        [HttpPost("add-client")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddClientByAdmin([FromBody] AddClientByAdminDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.AddClientByAdminAsync(model);

            if (!string.IsNullOrEmpty(result.Message) && result.Message.Contains("déjà"))
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPost("change-first-password")]
        public async Task<IActionResult> ChangeFirstPassword([FromBody] ChangePasswordDTO model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.ChangeFirstPasswordAsync(model);

                if (!result.IsAuthenticated)
                    return BadRequest(result.Message);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); 
            }
        }

        [HttpDelete("delete/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var result = await _authService.DeleteUserAsync(userId);

            if (!string.IsNullOrEmpty(result))
                return BadRequest(result);

            return Ok("Utilisateur supprimé avec succès.");
        }
    }
}
