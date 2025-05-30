using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class ArticleDto
    {
        public int Id { get; set; }

        [StringLength(255)]
        public string Nom { get; set; } = null!;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18, 2)")]
        public decimal Prix { get; set; }

        public int? CategorieId { get; set; }

        [StringLength(100)]
        public string? Marque { get; set; }

        public int Quantite { get; set; }
    }
}
