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
    public class ArticlesController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;

        public ArticlesController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Articles
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetArticleDto>>> GetArticles()
        {
            // Randomise les articles 
            var articles = await _context.Articles
                .OrderBy(a => Guid.NewGuid()) 
                .ToListAsync();

            var articlesDto = _mapper.Map<List<GetArticleDto>>(articles);

            foreach (var dto in articlesDto)
            {
                if (dto.DateAjout != null && (DateTime.UtcNow - dto.DateAjout.Value).TotalDays <= 3)
                {
                    dto.Badge = "Nouveau";
                }
                else
                {
                    dto.Badge = null;
                }
            }

            return articlesDto;
        }


        // GET: api/Articles/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetArticleDto>> GetArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            
            if (article == null)
            {
                return NotFound();
            }
            var articleDto = _mapper.Map<GetArticleDto>(article);
            
            if (articleDto.DateAjout != null && (DateTime.UtcNow - articleDto.DateAjout.Value).TotalDays <= 3)
            {
                articleDto.Badge = "Nouveau";
            }
            else
            {
                articleDto.Badge = null;
            }
            
            return articleDto;
        }

        // GET: api/Articles/Categorie/5
        [AllowAnonymous]
        [HttpGet("Categorie/{CategorieId}")]
        public async Task<ActionResult<IEnumerable<GetArticleDto>>> GetArticleByCategorie(int CategorieId)
        {
            var articles = await (from art in  _context.Articles
                           where art.CategorieId == CategorieId
                                  select art).ToListAsync();


            if (articles == null)
            {
                return NotFound();
            }
            var articlesDto = _mapper.Map<List<GetArticleDto>>(articles);

            foreach (var dto in articlesDto)
            {
                if (dto.DateAjout != null && (DateTime.UtcNow - dto.DateAjout.Value).TotalDays <= 3)
                {
                    dto.Badge = "Nouveau";
                }
                else
                {
                    dto.Badge = null;
                }
            }
            return articlesDto;
        }


        // GET: api/Articles/nouveautes
        [AllowAnonymous]
        [HttpGet("nouveautes")]
        public async Task<ActionResult<IEnumerable<GetArticleDto>>> GetNouveauxArticles()
        {
            var articles = await _context.Articles
                .OrderByDescending(a => a.DateAjout) // Tri par date décroissante
                .Take(10) // Limite aux 10 derniers articles
                .ToListAsync();

            if (articles == null || !articles.Any())
            {
                return NotFound();
            }

            var articlesDto = _mapper.Map<List<GetArticleDto>>(articles);
            foreach (var dto in articlesDto)
            {
               
                dto.Badge = "Nouveau";
                
            }
            return articlesDto;
        }


        // GET: api/Articles/les-plus-vendus
        [AllowAnonymous]
        [HttpGet("les-plus-vendus")]
        public async Task<ActionResult<IEnumerable<GetArticleDto>>> GetArticlesLesPlusVendus()
        {
            var articles = await _context.Articles
                .OrderByDescending(a => a.Ventes) // Tri par nombre de ventes décroissant
                .Take(10) // Limite aux 10 articles les plus vendus
                .ToListAsync();

            if (articles == null || !articles.Any())
            {
                return NotFound();
            }

            var articlesDto = _mapper.Map<List<GetArticleDto>>(articles);
            foreach (var dto in articlesDto)
            {
                if (dto.DateAjout != null && (DateTime.UtcNow - dto.DateAjout.Value).TotalDays <= 3)
                {
                    dto.Badge = "Nouveau";
                }
                else
                {
                    dto.Badge = null;
                }
            }
            return articlesDto;
        }


        // PUT: api/Articles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticle(int id, ArticleDto article)
        {
            if (id != article.Id)
            {
                return BadRequest();
            }
            var articleModifie = await _context.Articles.FindAsync(id);
            if (articleModifie == null)
            {
                return BadRequest();
            }

            var categorieId = await _context.Categories.FindAsync(article.CategorieId);
            if (categorieId == null)
            {
                return NotFound($"Catégorie d'article inexistant");
            }

            _mapper.Map(article, articleModifie);
            _context.Entry(articleModifie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticleExists(id))
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

        // POST: api/Articles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ArticleDto>> PostArticle(ArticleDto articleDto)
        {

            var article = _mapper.Map<Article>(articleDto);

            var categorie = await _context.Categories.FindAsync(articleDto.CategorieId);
            if (categorie == null)
            {
                return NotFound("Catégorie d'article inexistant");
            }
            article.CategorieId = categorie.Id;
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            var createdArticle = _mapper.Map<ArticleDto>(article);

            return CreatedAtAction("GetArticle", new { id = article.Id }, createdArticle);
        }




        // DELETE: api/Articles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticles(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            article.Statut = "Indisponible";
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool ArticleExists(int id)
        {
            return _context.Articles.Any(e => e.Id == id);
        }
    }
}
