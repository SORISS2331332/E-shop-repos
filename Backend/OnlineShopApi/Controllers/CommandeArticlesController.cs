using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
    public class CommandeArticlesController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;


        public CommandeArticlesController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/CommandeArticles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommandeArticleDto>>> GetCommandeArticles()
        {
            var commandesArticles = await _context.CommandeArticles.ToListAsync();
            var commandesArticlesDto = _mapper.Map<List<CommandeArticleDto>>(commandesArticles);
            return commandesArticlesDto;
        }

        //Id de commande
        // GET: api/CommandeArticles/5
        [HttpGet("{idCommande}")]
        public async Task<ActionResult<IEnumerable<CommandeArticleDto>>> GetCommandeArticle(int idCommande)
        {
            var commandesArticles = await (from comArt in _context.CommandeArticles
                                           where comArt.IdCommande == idCommande
                                           select comArt).ToListAsync();

            if (commandesArticles == null)
            {
                return NotFound();
            }
            var commandesArticlesDto = _mapper.Map<List<CommandeArticleDto>>(commandesArticles);
            return Ok(commandesArticlesDto);
        }


        // POST: api/CommandeArticles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CommandeArticleDto>> PostCommandeArticle(CommandeArticleDto commandeArticleDto)
        {
            var commandeArticle = _mapper.Map<CommandeArticle>(commandeArticleDto);

            _context.CommandeArticles.Add(commandeArticle);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CommandeArticleExists(commandeArticle.IdArticle, commandeArticle.IdCommande))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }


            //Mettre à jour la quantité de l'article
            var article = await _context.Articles.FindAsync(commandeArticle.IdArticle);

            if (article == null)
            {
                return NotFound($"Article avec ID {commandeArticle.IdArticle} non trouvé");
            }

            // Vérifier que la quantité demandée est disponible en stock
            if (article.Quantite >= commandeArticle.Quantite)
            {
                article.Quantite -= commandeArticle.Quantite;

                article.Ventes += commandeArticle.Quantite;
                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest($"Quantité de l'article {commandeArticle.IdArticle} insuffisante en stock");
            }

            return Ok(commandeArticleDto);
        }


        private bool CommandeArticleExists(int idArticle, int idCommande)
        {
            return _context.CommandeArticles.Any(e => (e.IdCommande == idCommande && e.IdArticle == idArticle));
        }
    }
}
