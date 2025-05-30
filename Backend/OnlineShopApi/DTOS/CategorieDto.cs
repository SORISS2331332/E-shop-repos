using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class CategorieDto
    {
        public int Id { get; set; }

        [StringLength(100)]
        public string Nom { get; set; } 
    }
}
