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
    public class PaniersController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;


        public PaniersController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //Paniers selon l'id de l'utilisateur
        // GET: api/Paniers/utilisateur/id
        [HttpGet("utilisateur/{id}")]
        public async Task<ActionResult<IEnumerable<PanierDto>>> GetPaniers(string id)
        {
            var paniers = await (from panier in _context.Paniers
                          where panier.UtilisateurId == id
                          select panier).ToListAsync();
            if (!paniers.Any())
            {
                return NotFound(new { message = "Aucun panier trouvé pour cet utilisateur." });
            }
            var paniersDto = _mapper.Map<List<PanierDto>>(paniers);
            return Ok(paniersDto);
        }



        // PUT: api/Paniers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPanier(int id, PanierDto panierDto)
        {
            if (id != panierDto.Id)
            {
                return BadRequest(new { message = "L'ID du panier ne correspond pas." });
            }
            var panierModifie = await _context.Paniers.FindAsync(id);
            if (panierModifie == null)
            {
                return NotFound(new { message = "Panier non trouvé." });
            }
            _mapper.Map(panierDto, panierModifie);
            _context.Entry(panierModifie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PanierExists(id))
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



        //POST: api/Paniers/utilisateur/id/ajouter-panier
        [HttpPost("utilisateur/{utilisateurId}/ajouter-panier")]
        public async Task<ActionResult> AjouterArticleAuPanier(string utilisateurId, [FromBody] AjouterArticlePanierDto ajoutArticleDto)
        {
            try
            {
                // Vérifier si l'article existe déjà dans le panier pour cet utilisateur
                var panierExist = await _context.Paniers
                                                .FirstOrDefaultAsync(p => p.UtilisateurId == utilisateurId && p.ArticleId == ajoutArticleDto.ArticleId);

                // Si l'article existe, on met à jour la quantité
                if (panierExist != null)
                {
                    var nouvelleQuantite = panierExist.Quantite + ajoutArticleDto.Quantite;

                    // Vérifier la quantité disponible en stock
                    var article = await _context.Articles.FindAsync(ajoutArticleDto.ArticleId);
                    if (article == null || nouvelleQuantite > article.Quantite)
                    {
                        return BadRequest("Quantité demandée dépasse le stock disponible.");
                    }

                    panierExist.Quantite = nouvelleQuantite;
                    _context.Paniers.Update(panierExist);
                    await _context.SaveChangesAsync();

                    return Ok(); 
                }
                else
                {
                    // Si l'article n'est pas déjà dans le panier, on l'ajoute
                    var article = await _context.Articles.FindAsync(ajoutArticleDto.ArticleId);
                    if (article == null || ajoutArticleDto.Quantite > article.Quantite)
                    {
                        return BadRequest("Quantité demandée dépasse le stock disponible.");
                    }

                    var panier = new Panier
                    {
                        UtilisateurId = utilisateurId,
                        ArticleId = ajoutArticleDto.ArticleId,
                        Quantite = ajoutArticleDto.Quantite
                    };

                    _context.Paniers.Add(panier);
                    await _context.SaveChangesAsync();

                    return Ok();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erreur serveur : " + ex.Message);
            }
        }


        //PUT: api/Paniers/idPanier/modifier-quantite
        [HttpPut("{id}/modifier-quantite")]
        public async Task<IActionResult> ModifierQuantiteArticle(int id, [FromBody] int nouvelleQuantite)
        {
            var panier = await _context.Paniers.FindAsync(id);
            if (panier == null)
            {
                return NotFound(new { message = "Article dans le panier non trouvé." });
            }

            panier.Quantite = nouvelleQuantite;
            _context.Entry(panier).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        //DELETE: api/Paniers/vider/utilisateurId
        [HttpDelete("vider/{utilisateurId}")]
        public async Task<IActionResult> ViderPanier(string utilisateurId)
        {
            var paniers = await _context.Paniers
                .Where(p => p.UtilisateurId == utilisateurId)
                .ToListAsync();

            if (!paniers.Any())
            {
                return NotFound(new {message = "Aucun panier trouvé pour cet utilisateur." });
            }

            _context.Paniers.RemoveRange(paniers);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // GET: api/Paniers/articles/{utilisateurId}
        [HttpGet("articles/{utilisateurId}")]
        public async Task<ActionResult<IEnumerable<PanierArticleDto>>> GetArticlesInPanier(string utilisateurId)
        {
            var paniers = await (   from panier in _context.Paniers
                                    join article in _context.Articles on panier.ArticleId equals article.Id
                                    where panier.UtilisateurId == utilisateurId
                                    select new PanierArticleDto
                                    {
                                        ArticleId = article.Id,
                                        Nom = article.Nom,
                                        Prix = article.Prix,
                                        Quantite = panier.Quantite,
                                        Image = _context.Images
                                                    .Where(img => img.ArticleId == article.Id)
                                                    .Select(img => img.Lien)
                                                    .FirstOrDefault()
                                    }).ToListAsync();

            if (paniers == null || !paniers.Any())
            {
                return NotFound(new { message = "Aucun article trouvé dans le panier." });
            }

            return Ok(paniers);
        }

        // DELETE: api/Paniers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePanier(int id)
        {
            var panier = await _context.Paniers.FindAsync(id);
            if (panier == null)
            {
                return NotFound();
            }

            _context.Paniers.Remove(panier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PanierExists(int id)
        {
            return _context.Paniers.Any(e => e.Id == id);
        }
    }
}
