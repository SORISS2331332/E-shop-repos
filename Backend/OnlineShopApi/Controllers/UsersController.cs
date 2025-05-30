using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineShopApi.Data;
using OnlineShopApi.DTOS;
using OnlineShopApi.Models;

namespace OnlineShopApi.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly UserManager<Utilisateur> _userManager;
        private readonly IMapper _mapper;

        public UsersController(EcommerceContext context, IMapper mapper, UserManager<Utilisateur> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetUserDto>>> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var usersDto = _mapper.Map<List<GetUserDto>>(users);
            return usersDto;
        }

        // GET: api/users/5gfdg
        [HttpGet("{id}")]
        public async Task<ActionResult<GetUserDto>> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);


            if (user == null)
            {
                return NotFound(new { message = "Utilisateur introuvable." });

            }
            var userDto = _mapper.Map<GetUserDto>(user);
            var roles = await _userManager.GetRolesAsync(user);
            userDto.Role = roles.FirstOrDefault();
            return userDto;
        }

        // GET: api/users/5gfdg
        [HttpGet("email/{email}")]
        public async Task<ActionResult<GetUserDto>> GetUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);


            if (user == null)
            {
                return NotFound(new { message = "Utilisateur introuvable." });

            }
            var userDto = _mapper.Map<GetUserDto>(user);
            var roles = await _userManager.GetRolesAsync(user);
            userDto.Role = roles.FirstOrDefault();
            return userDto;
        }

        // PUT: api/users/tgfregfd
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, UtilisateurDto userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest();
            }
            var userModifie = await _context.Users.FindAsync(id);

            if (userModifie == null)
            {
                return BadRequest();
            }


            _mapper.Map(userDto, userModifie);
            _context.Entry(userModifie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!usersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/users/update-adresse
        // Met à jour l'IdAdresse d'un utilisateur
        [HttpPut("update-adresse")]
        public async Task<IActionResult> UpdateAdresse([FromBody] UpdateAdresseDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FindAsync(model.IdUtilisateur);
            if (user == null)
                return NotFound(new { message = "Utilisateur non trouvé." });

            var adresse = await _context.Adresses.FindAsync(model.IdAdresse);
            if (adresse == null)
                return NotFound(new { message = "Adresse introuvable." });

            user.AdresseId = model.IdAdresse;

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Adresse mise à jour avec succès." });
        }


        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (model.NewPassword != model.ConfirmNewPassword)
                return BadRequest("Le nouveau mot de passe et la confirmation ne correspondent pas.");

            var user = await _context.Users.FindAsync(model.userId);
            if (user == null)
                return Unauthorized();

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("Mot de passe modifié avec succès.");
        }

        
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasswordNoToken([FromBody] ChangePasswordDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (model.NewPassword != model.ConfirmNewPassword)
                return BadRequest("Le nouveau mot de passe et la confirmation ne correspondent pas.");

            var user = await _userManager.FindByIdAsync(model.userId);
            if (user == null)
                return BadRequest("Utilisateur introuvable.");
            var removeResult = await _userManager.RemovePasswordAsync(user);
            if (!removeResult.Succeeded)
                return BadRequest("Échec lors de la suppression de l'ancien mot de passe.");

            var addResult = await _userManager.AddPasswordAsync(user, model.NewPassword);
            if (!addResult.Succeeded)
                return BadRequest(addResult.Errors);

            return Ok("Mot de passe réinitialisé avec succès.");
        }

        private bool usersExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
