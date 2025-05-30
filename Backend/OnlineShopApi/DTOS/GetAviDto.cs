using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class GetAviDto
    {
        public int Id { get; set; }

        public string? UtilisateurId { get; set; }

        public int ArticleId { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? Date { get; set; } = DateTime.Now;

        public int Note { get; set; }

        [StringLength(1000)]
        public string? Commentaire { get; set; }

        public UtilisateurDto UtilisateurDto { get; set; } = null!;
    }
}
