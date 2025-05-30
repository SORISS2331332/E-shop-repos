using OnlineShopApi.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class UtilisateurDto
    {
        public string? Id {get;set;}

        [StringLength(100)]
        public string Nom { get; set; } = null!;

        [StringLength(100)]
        public string Prenom { get; set; } = null!;


        public string? Email { get; set; }


        public string? Photo { get; set; }



    }
}
