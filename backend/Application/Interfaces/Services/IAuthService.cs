using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthDTO> RegisterAsync(RegisterUserDTO model);
        Task<AuthDTO> GetTokenAsync(TokenRequestDTO model);
        Task<string> AddRoleAsync(AddUserInRoleDTO model);

        Task<IEnumerable<UserDTO>> GetAllUsers();

        Task<UserDTO> GetUserByCIN(String cin);
        Task<AuthDTO> AddClientByAdminAsync(AddClientByAdminDTO model);
        Task<AuthDTO> ChangeFirstPasswordAsync(ChangePasswordDTO model);
        Task<string> DeleteUserAsync(string userId);
    }
}
