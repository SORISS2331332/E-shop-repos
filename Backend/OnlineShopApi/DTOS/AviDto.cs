using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using OnlineShopApi.Models;

namespace OnlineShopApi.DTOS
{
    public class AviDto
    {
        public int Id { get; set; }

        public string? UtilisateurId { get; set; }

        public int ArticleId { get; set; }

        public DateTime? Date { get; set; } = DateTime.Now;

        public int Note { get; set; }

        [StringLength(1000)]
        public string? Commentaire { get; set; }

    }
}
