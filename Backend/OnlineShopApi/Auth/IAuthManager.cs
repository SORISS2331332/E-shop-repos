using OnlineShopApi.DTOS;
using Microsoft.AspNetCore.Identity;

namespace OnlineShopApi.Auth
{
    public interface IAuthManager
    {
        Task<IEnumerable<IdentityError>> RegisterClient(RegisterModel register);
        Task<IEnumerable<IdentityError>> RegisterAdmin(RegisterModel register);
        Task<AuthResponse> Login(LoginModel login);
        Task<AuthResponse> Token(TokenRequest request);
    }
}