using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class ImageDto
    {
        public int Id { get; set; }

        public int ArticleId { get; set; }

        [StringLength(255)]
        public string Lien { get; set; } = null!;
    }
}
