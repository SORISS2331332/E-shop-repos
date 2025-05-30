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
    public class AdressesController : ControllerBase
    {
        private readonly EcommerceContext _context; 
        private readonly IMapper _mapper;

        public AdressesController(EcommerceContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

       
        //Id Utilisateur
        // GET: api/Adresses/5
        [HttpGet("{utilisateurId}")]
        public async Task<ActionResult<AdresseDto>> GetAdresse(string utilisateurId)
        {
            var adresse = await _context.Adresses
                            .Where(a => a.Utilisateurs.Any(u => u.Id == utilisateurId))
                            .FirstOrDefaultAsync();


            if (adresse == null)
            {
                return NotFound();
            }

            return _mapper.Map<AdresseDto>(adresse);
        }

        // PUT: api/Adresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdresse(int id, AdresseDto adresseDto)
        {
            if (id != adresseDto.Id)
            {
                return BadRequest();
            }
            var adresseModifie = await _context.Adresses.FindAsync(id);
            if(adresseModifie == null)
            {
                return BadRequest();
            }
            _mapper.Map(adresseDto, adresseModifie);
            _context.Entry(adresseModifie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdresseExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            var createdAdresseDto = _mapper.Map<AdresseDto>(adresseModifie);
            return Ok(createdAdresseDto);
        }

        // POST: api/Adresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AdresseDto>> PostAdresse(AdresseDto adresseDto)
        {
            var adresse = _mapper.Map<Adresse>(adresseDto);
            _context.Adresses.Add(adresse);
            await _context.SaveChangesAsync();
            var createdAdresseDto = _mapper.Map<AdresseDto>(adresse);
            return Ok(createdAdresseDto);
        }

        // DELETE: api/Adresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdresse(int id)
        {
            var adresse = await _context.Adresses.FindAsync(id);
            if (adresse == null)
            {
                return NotFound();
            }

            _context.Adresses.Remove(adresse);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AdresseExists(int id)
        {
            return _context.Adresses.Any(e => e.Id == id);
        }
    }
}
