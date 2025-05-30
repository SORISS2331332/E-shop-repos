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
    public class FavorisController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;

        public FavorisController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        

        // GET: api/Favoris/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FavorisDto>> GetFavoris(int id)
        {
            var favoris = await _context.Favoris.FindAsync(id);

            if (favoris == null)
            {
                return NotFound();
            }
            var favorisDto = _mapper.Map<FavorisDto>(favoris);
            return favorisDto;
        }

        //Favoris selon l'id de l'utilisateur
        // GET: api/Favoris/utilisateur/id
        [HttpGet("utilisateur/{id}")]
        public async Task<ActionResult<IEnumerable<FavorisDto>>> GetFavoris(string id)
        {
            var favoris = await (from fav in _context.Favoris
                                 where fav.UtilisateurId == id
                                 select fav).ToListAsync();
            if (!favoris.Any())
            {
                return NotFound(new { message = "Aucun favoris trouvé pour cet utilisateur." });
            }
            var favorisDto = _mapper.Map<List<FavorisDto>>(favoris);
            return Ok(favorisDto);
        }

        // GET: api/Favoris/articles/{utilisateurId}
        [HttpGet("articles/{utilisateurId}")]
        public async Task<ActionResult<IEnumerable<GetArticleDto>>> GetArticlesInFavoris(string utilisateurId)
        {
            var favoris = await (from fav in _context.Favoris
                                 join article in _context.Articles on fav.ArticleId equals article.Id
                                 where fav.UtilisateurId == utilisateurId
                                 select fav).ToListAsync();

            if (favoris == null || !favoris.Any())
            {
                return NotFound(new { message = "Aucun article trouvé dans le panier." });
            }

            return Ok(favoris);
        }



        // POST: api/Favoris
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostFavoris(FavorisDto favorisDto)
        {
            // Vérifie si le favori existe déjà
            bool favoriExiste = await _context.Favoris.AnyAsync(f =>
                f.UtilisateurId == favorisDto.UtilisateurId &&
                f.ArticleId == favorisDto.ArticleId);

            if (favoriExiste)
            {
                return Conflict("Cet article est déjà dans les favoris.");
            }

            var fav = _mapper.Map<Favoris>(favorisDto);
            _context.Favoris.Add(fav);
            await _context.SaveChangesAsync();

            return Ok(favorisDto);
        }

        // DELETE: api/Favoris/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavoris(int id)
        {
            var favoris = await _context.Favoris.FindAsync(id);
            if (favoris == null)
            {
                return NotFound();
            }

            _context.Favoris.Remove(favoris);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FavorisExists(int id)
        {
            return _context.Favoris.Any(e => e.Id == id);
        }
    }
}
