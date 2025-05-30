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
    public class ImagesController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;
        public ImagesController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        //Récupérer toutes les images selon l'id de l'article
        // GET: api/Images/5
        [HttpGet("{idArticle}")]
        public async Task<ActionResult<IEnumerable<ImageDto>>> GetImage(int idArticle)
        {
            var images = await (from img in _context.Images
                         where img.ArticleId == idArticle
                                select img).ToListAsync();


            if (images == null || !images.Any())
            {
                return NotFound();
            }
            var imagesDto = _mapper.Map<List<ImageDto>>(images);
            return imagesDto; 
        }

        // PUT: api/Images/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutImage(int id, ImageDto imageDto)
        {
            if (id != imageDto.Id)
            {
                return BadRequest();
            }

            var image = await _context.Images.FindAsync(imageDto.Id);
            if(image == null)
            {
                return BadRequest();
            }
            _mapper.Map(imageDto, image);
            _context.Entry(image).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImageExists(id))
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

        // POST: api/Images
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        
        [HttpPost]
        public async Task<ActionResult<ImageDto>> PostImage(ImageDto imageDto)
        {
            var image = _mapper.Map<Image>(imageDto);
            _context.Images.Add(image);
            await _context.SaveChangesAsync();
            var Retour = _mapper.Map<ImageDto>(image);
            return Ok(Retour);
        }

        // DELETE: api/Images/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
            {
                return NotFound();
            }

            _context.Images.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ImageExists(int id)
        {
            return _context.Images.Any(e => e.Id == id);
        }
    }
}
