using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using OnlineShopApi.DTOS;
using OnlineShopApi.Models;

namespace OnlineShopApi.Auth
{
    public class AuthManager(UserManager<Utilisateur> userManager, IConfiguration
    configuration) : IAuthManager
    {
        private readonly UserManager<Utilisateur> _userManager = userManager;
        private readonly IConfiguration _configuration = configuration;
        private Utilisateur _user;
        public async Task<AuthResponse> Login(LoginModel login)
        {
            _user = await _userManager.FindByNameAsync(login.Email);
            bool isValidUser = _user is not null
            && await _userManager.CheckPasswordAsync(_user, login.Password);
            if (_user == null || !isValidUser)
            {
                return null;
            }
            var token = await GenerateToken();
            return new AuthResponse
            {
                Token = token,
                UserId = _user.Id
            };
        }

        //Gérérer un token en cas d'auth google, github
        public async Task<AuthResponse> Token(TokenRequest request)
        {
            _user = await _userManager.FindByNameAsync(request.Email);
            bool isValidUser = _user is not null;
            if (_user == null || !isValidUser)
            {
                return null;
            }
            var token = await GenerateToken();
            return new AuthResponse
            {
                Token = token,
                UserId = _user.Id
            };
        }
        public async Task<IEnumerable<IdentityError>> RegisterClient(RegisterModel register)
        {
            Utilisateur user = new Utilisateur
            {
                Nom = register.Nom,
                Prenom = register.Prenom,
                UserName = register.Email,
                Email = register.Email,
                PhoneNumber = register.Phone,
                DateInscription =DateTime.UtcNow

            };
            var result = await _userManager.CreateAsync(user, register.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "CLIENT");
            }
            return result.Errors;
        }
        public async Task<IEnumerable<IdentityError>> RegisterAdmin(RegisterModel register)
        {
            Utilisateur user = new Utilisateur
            {
                Nom = register.Nom,
                Prenom = register.Prenom,
                UserName = register.Email,
                Email = register.Email,
                PhoneNumber = register.Phone,
                DateInscription = DateTime.UtcNow

            };
            var result = await _userManager.CreateAsync(user, register.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "ADMIN");
            }
            return result.Errors;
        }
        private async Task<string> GenerateToken()
        {
            var securityKey = new
            SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var credentials = new SigningCredentials(securityKey,
            SecurityAlgorithms.HmacSha256);
            var roles = await _userManager.GetRolesAsync(_user);
            var roleClaims = roles.Select(x => new Claim(ClaimTypes.Role, x)).ToList();
            var userClaims = await _userManager.GetClaimsAsync(_user);
            var claims = new List<Claim>
            {
                new (JwtRegisteredClaimNames.Sub, _user.UserName),
                new (JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new (JwtRegisteredClaimNames.Email, _user.Email),
                 new Claim(ClaimTypes.NameIdentifier, _user.Id),
            }.Union(userClaims).Union(roleClaims);
            var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(
            Convert.ToInt32(_configuration["Jwt:DurationInMinutes"])),
            signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
