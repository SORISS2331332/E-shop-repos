using OnlineShopApi.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using NuGet.Protocol;

namespace OnlineShopApi.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAuthManager _authManager ;
        private readonly ILogger<AccountsController> _logger ;

        public AccountsController(IAuthManager authManager, ILogger<AccountsController> logger)
        {
            _authManager = authManager;
            _logger = logger;
        }
        // POST: api/Accounts/register-client
        [HttpPost]
        [Route("register-client")]
        public async Task<ActionResult> RegisterClient([FromBody] DTOS.RegisterModel register)
        {
            var errors = await _authManager.RegisterClient(register);
            if (errors.Any())
            {
                foreach (var error in errors)
                    ModelState.AddModelError(error.Code, error.Description);
                _logger.LogError("Echec d'inscription d'un client");

                return BadRequest(ModelState);
            }
            _logger.LogInformation("Tentative d'inscription d'un nouvel client");
            return Ok();
        }
        // POST: api/Accounts/register-admin
        [HttpPost]
        [Route("register-admin")]
        public async Task<ActionResult> RegisterAdmin([FromBody] DTOS.RegisterModel register)
        {
            var errors = await _authManager.RegisterAdmin(register);
            if (errors.Any())
            {
                foreach (var error in errors)
                    ModelState.AddModelError(error.Code, error.Description);
                _logger.LogError("Echec d'inscription de admin");
                return BadRequest(ModelState);
            }
            _logger.LogInformation("Tentative d'inscription d'un nouveau admin");
            return Ok();
        }
        // POST: api/Accounts/login
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] DTOS.LoginModel login)
        {
            var authResponse = await _authManager.Login(login);
            if (authResponse is null)
            {
                _logger.LogWarning("Echec de connexion");
                return Unauthorized();
            }
            _logger.LogInformation("Tentative de connexion");
            return Ok(authResponse);
        }

        //Gérérer un token en cas d'auth google, github
        // POST: api/Accounts/token
        [HttpPost("token")]
        public async Task<IActionResult> GetToken([FromBody] TokenRequest request)
        {
            var authResponse = await _authManager.Token(request);
            if (authResponse is null)
            {
                _logger.LogWarning("Echec de connexion");
                return Unauthorized();
            }
            _logger.LogInformation("Tentative de connexion");
            return Ok(authResponse);
        }

    }
}
