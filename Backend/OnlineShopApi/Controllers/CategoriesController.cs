using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OnlineShopApi.Data;
using OnlineShopApi.DTOS;
using OnlineShopApi.Models;

namespace OnlineShopApi.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;

        public CategoriesController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Categories
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategorieDto>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            var categoriesDto = _mapper.Map<List<CategorieDto>>(categories);
            return categoriesDto;
        }

        // GET: api/Categories/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<CategorieDto>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            
            if (category == null)
            {
                return NotFound();
            }
            var categorieDto = _mapper.Map<CategorieDto>(category);
            return categorieDto;
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CategorieDto category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }
            var categorieModifie = await _context.Categories.FindAsync(category.Id);
            if(categorieModifie == null)
            {
                return BadRequest();
            }
            _mapper.Map(category,categorieModifie);
            _context.Entry(categorieModifie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        
        [HttpPost]
        public async Task<ActionResult<CategorieDto>> PostCategory(CategorieDto categorieDto)
        {
            var categorie = _mapper.Map<Category>(categorieDto);    
            _context.Categories.Add(categorie);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = categorie.Id }, _mapper.Map<CategorieDto>(categorie));
        }

        // DELETE: api/Categories/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            // 1. Récupère les articles liés à cette catégorie
            var articles = await _context.Articles
                .Where(a => a.CategorieId == id)
                .ToListAsync();
            if(articles.Count != 0 && articles != null)
            {
                foreach (var article in articles)
                {
                    article.CategorieId = null;
                }
                await _context.SaveChangesAsync();
            }
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
