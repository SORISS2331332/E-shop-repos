using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class CommandesController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;

        public CommandesController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Commandes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommandeDto>>> GetCommandes()
        {
            var commandes = await _context.Commandes.ToListAsync();
            var commandesDto = _mapper.Map<List<CommandeDto>>(commandes);
            return commandesDto;
        }

        // GET: api/Commandes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CommandeDto>> GetCommande(int id)
        {
            var commande = await _context.Commandes.FindAsync(id);
            var commandeDto = _mapper.Map<CommandeDto>(commande);

            if (commande == null)
            {
                return NotFound();
            }

            return commandeDto;
        }

        // GET: api/Commandes/utilisateur/g3e
        [HttpGet("utilisateur/{id}")]
        public async Task<ActionResult<IEnumerable<CommandeDto>>> GetUtilisateurCommande(string id)
        {
            var commandes = await (from com in _context.Commandes
                           where com.UtilisateurId == id
                           select com).ToListAsync();
            

            if (commandes == null || commandes.Count() == 0)
            {
                return NotFound();
            }
            var commandesDto = _mapper.Map<List<CommandeDto>>(commandes);

            return commandesDto;
        }
        

        // GET: api/Commandes/utilisateur/g3e/derniere
        [HttpGet("utilisateur/{id}/derniere")]
        public async Task<ActionResult<CommandeDto>> GetDerniereCommandeUtilisateur(string id)
        {
            var commande = await _context.Commandes
                .Where(c => c.UtilisateurId == id)
                .OrderByDescending(c => c.Date)
                .FirstOrDefaultAsync();

            if (commande == null)
            {
                return NotFound();
            }

            var commandeDto = _mapper.Map<CommandeDto>(commande);
            return commandeDto;
        }


        // PUT: api/Commandes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCommande(int id, CommandeDto commandeDto)
        {
            if (id != commandeDto.Id)
            {
                return BadRequest();
            }

            var commandeModifie = await _context.Commandes.FindAsync(id);
            if(commandeModifie == null)
            {
                return BadRequest();
            }
            _mapper.Map( commandeDto, commandeModifie);
            _context.Entry(commandeModifie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommandeExists(id))
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

        // POST: api/Commandes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CommandeDto>> PostCommande(CommandeDto commandeDto)
        {

            var commande = _mapper.Map<Commande>( commandeDto);
          
           
            _context.Commandes.Add(commande);
            await _context.SaveChangesAsync();
            var createdCommande = _mapper.Map<CommandeDto>(commande);
            return Ok(createdCommande);
        }


        private bool CommandeExists(int id)
        {
            return _context.Commandes.Any(e => e.Id == id);
        }
    }
}
