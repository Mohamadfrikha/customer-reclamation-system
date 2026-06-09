using Application.DTOs;
using Application.Interfaces;
using Application.Interfaces.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
namespace Application.Interfaces.Helpers;

public class AuthService : IAuthService
{
    private readonly UserManager<Utilisateur> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly JWT _jwt;
    private readonly IMailService _mailService;
    private readonly string _defaultPassword;
    public AuthService(UserManager<Utilisateur> userManager, RoleManager<IdentityRole> roleManager, IOptions<JWT> jwt, IMailService mailService,IConfiguration config)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _jwt = jwt.Value;
        _mailService = mailService;
        _defaultPassword = config["DefaultPassword"] ?? "Client123!";
    }

    public async Task<string> AddRoleAsync(AddUserInRoleDTO model)
    {
        var user = await _userManager.FindByIdAsync(model.UserId);

        if (user is null || !await _roleManager.RoleExistsAsync(model.Role))
            return "Invalid user ID or Role";

        if (await _userManager.IsInRoleAsync(user, model.Role))
            return "User already assigned to this role";



        var result = await _userManager.AddToRoleAsync(user, model.Role);

        return result.Succeeded ? string.Empty : "Sonething went wrong";
    }

    public async Task<IEnumerable<UserDTO>> GetAllUsers()
    {
        var users = _userManager.Users.ToList();

        var userDTOs = new List<UserDTO>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            userDTOs.Add(new UserDTO
            {
                Id = user.Id,
                CIN=user.CIN,
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ImageUrl = user.ImageUrl,
                Roles = roles.ToList(),
                PhoneNumber = user.PhoneNumber,
                Adresse=user.Adresse
            });
        }

        return userDTOs;
    }

    public async Task<AuthDTO> GetTokenAsync(TokenRequestDTO model)
    {
        var authModel = new AuthDTO();

        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
        {
            authModel.Message = "Email or Password is incorrect!";
            return authModel;
        }

        if (user.ForcePasswordChange)
        {
            authModel.IsAuthenticated = false;
            authModel.Message = "PASSWORD_CHANGE_REQUIRED";
            authModel.Email = user.Email;
            return authModel;
        }

        var jwtSecurityToken = await CreateJwtToken(user);
        var rolesList = await _userManager.GetRolesAsync(user);

        authModel.IsAuthenticated = true;
        authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        authModel.Email = user.Email;
        authModel.Username = user.UserName;
        authModel.ExpiresOn = jwtSecurityToken.ValidTo;
        authModel.Roles = rolesList.ToList();
        authModel.ImageUrl = user.ImageUrl;

        return authModel;
    }

    public async Task<UserDTO> GetUserByCIN(string cin)
    {
        var user = _userManager.Users.FirstOrDefault(u => u.CIN == cin);

        if (user is null) return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new UserDTO
        {
            Id = user.Id,
            CIN = user.CIN,
            Username = user.UserName,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            ImageUrl = user.ImageUrl,
            Roles = roles.ToList(),
            PhoneNumber = user.PhoneNumber,
            Adresse = user.Adresse
        };
    }

    public async Task<AuthDTO> RegisterAsync(RegisterUserDTO model)
    {
        if (await _userManager.FindByEmailAsync(model.Email) is not null)
            return new AuthDTO { Message = "Email is already registered!" };
        if (await _userManager.FindByNameAsync(model.Username) is not null)
            return new AuthDTO { Message = "Username is already registered!" };
        var roleExists = await _roleManager.RoleExistsAsync("Client");
        if (!roleExists)
        {
            await _roleManager.CreateAsync(new IdentityRole("Client"));
        }
        var user = new Utilisateur
        {
            UserName = model.Username,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Adresse = model.Adresse,
            CIN = model.CIN,
            ImageUrl = "/images/user.png",
            PhoneNumber = model.PhoneNumber
        };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            var errors = string.Empty;

            foreach (var error in result.Errors)
                errors += $"{error.Description},";
            return new AuthDTO { Message = errors };
        }
        await _userManager.AddToRoleAsync(user, "Client");

        var jwtSecurityToken = await CreateJwtToken(user);
        return new AuthDTO
        {
            Email = user.Email,
            ExpiresOn = jwtSecurityToken.ValidTo,
            IsAuthenticated = true,
            Roles = new List<string> { "Client" },
            Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
            Username = user.UserName,
            ImageUrl = user.ImageUrl

        };
    }

    private async Task<SecurityToken> CreateJwtToken(Utilisateur user)
    {
        var userClaims = await _userManager.GetClaimsAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        var roleClaims = new List<Claim>();
        foreach (var role in roles)
            roleClaims.Add(new Claim(ClaimTypes.Role, role));
        var claims = new[] {

            new Claim(JwtRegisteredClaimNames.Sub, user.UserName ?? ""),
            new Claim(JwtRegisteredClaimNames.Jti, Guid. NewGuid(). ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? "" ),
            new Claim("uid", user.Id) }.Union(userClaims).Union(roleClaims);
        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        var jwtSecurityToken = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_jwt.DurationInDays),
            signingCredentials: signingCredentials);
        return jwtSecurityToken;
    }

    public async Task<AuthDTO> AddClientByAdminAsync(AddClientByAdminDTO model)
    {
        // Vérifications
        if (await _userManager.FindByEmailAsync(model.Email) is not null)
            return new AuthDTO { Message = "Email déjà utilisé!" };

        if (await _userManager.FindByNameAsync(model.Username) is not null)
            return new AuthDTO { Message = "Username déjà utilisé!" };

        // Créer l'utilisateur
        var user = new Utilisateur
        {
            UserName = model.Username,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            CIN = model.CIN,
            PhoneNumber = model.PhoneNumber,
            Adresse = model.Adresse,
            ImageUrl = "/images/user.png",
            ForcePasswordChange = true   
        };

        // Créer avec le mot de passe par défaut
        var result = await _userManager.CreateAsync(user, _defaultPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return new AuthDTO { Message = errors };
        }

        // Assigner le rôle Client
        if (!await _roleManager.RoleExistsAsync("Client"))
            await _roleManager.CreateAsync(new IdentityRole("Client"));

        await _userManager.AddToRoleAsync(user, "Client");

        // Envoyer l'email avec les identifiants
        await _mailService.SendWelcomeEmailAsync(user.Email, user.UserName, _defaultPassword);

        return new AuthDTO
        {
            IsAuthenticated = false, // pas de token, c'est l'admin qui crée
            Message = $"Client {user.UserName} créé avec succès. Email envoyé à {user.Email}."
        };
    }

    public async Task<AuthDTO> ChangeFirstPasswordAsync(ChangePasswordDTO model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user is null)
            return new AuthDTO { Message = "Utilisateur introuvable." };

        // Vérifier le mot de passe temporaire
        var isValid = await _userManager.CheckPasswordAsync(user, model.TempPassword);
        if (!isValid)
            return new AuthDTO { Message = "Mot de passe temporaire incorrect." };

        var removeResult = await _userManager.RemovePasswordAsync(user);
        if (!removeResult.Succeeded)
            return new AuthDTO { Message = "Erreur suppression mot de passe." };

        var addResult = await _userManager.AddPasswordAsync(user, model.NewPassword);
        if (!addResult.Succeeded)
        {
            var errors = string.Join(", ", addResult.Errors.Select(e => e.Description));
            return new AuthDTO { Message = errors };
        }

        user.ForcePasswordChange = false;
        await _userManager.UpdateAsync(user);

        // Retourner le JWT
        var jwtToken = await CreateJwtToken(user);
        var roles = await _userManager.GetRolesAsync(user);

        return new AuthDTO
        {
            IsAuthenticated = true,
            Token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
            Email = user.Email,
            Username = user.UserName,
            ExpiresOn = jwtToken.ValidTo,
            Roles = roles.ToList(),
            ImageUrl = user.ImageUrl
        };
    }

    public async Task<string> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            return "Utilisateur introuvable.";

        var result = await _userManager.DeleteAsync(user);

        return result.Succeeded ? string.Empty : "Erreur lors de la suppression.";
    }


}
