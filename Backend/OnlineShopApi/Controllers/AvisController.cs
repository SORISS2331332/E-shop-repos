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
    public class AvisController : ControllerBase
    {
        private readonly EcommerceContext _context;
        private readonly IMapper _mapper;

        public AvisController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }



        //Tous les avis selon l'id de l'article
        // GET: api/Avis/article/5
        [HttpGet("article/{articleId}")]
        public async Task<ActionResult<IEnumerable<GetAviDto>>> GetAvisByArticle(int articleId)
        {
            var avis = await (from a in _context.Avis
                              join u in _context.Users
                              on a.UtilisateurId equals u.Id
                              where a.ArticleId == articleId
                              select new GetAviDto
                              {
                                  Id = a.Id,
                                  UtilisateurId = a.UtilisateurId,
                                  ArticleId = a.ArticleId,
                                  Commentaire = a.Commentaire,
                                  Note = a.Note,
                                  UtilisateurDto = new UtilisateurDto
                                  {
                                      Nom = u.Nom,
                                      Prenom = u.Prenom,
                                      Photo = u.Photo
                                  }
                              }).ToListAsync();




            if (avis == null || avis.Count == 0)
            {
                return NotFound("Aucun avis trouvé pour cet article.");
            }
            
            var avisDto = _mapper.Map<List<GetAviDto>>(avis);
            return Ok(avisDto);
        }


        // POST: api/Avis
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        
        [HttpPost]
        public async Task<ActionResult<AviDto>> PostAvi(AviDto aviDto)
        {
            var avis = _mapper.Map<Avi>(aviDto);
            try
            {
                _context.Avis.Add(avis);
                await _context.SaveChangesAsync();
                var avisRetour = _mapper.Map<AviDto>(avis);

                return Ok(avisRetour);
            }
            catch (Exception ex)
            {
                var innerMessage = ex.InnerException?.Message;
                return StatusCode(500, $"Erreur interne : {innerMessage}");
            }


            
        }


    
    }
}
