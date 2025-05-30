using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class GetUserDto
    {
        public string? Id { get; set; }

        [StringLength(100)]
        public string Nom { get; set; } = null!;

        [StringLength(100)]
        public string Prenom { get; set; } = null!;


        public string? Email { get; set; }


        public string? Photo { get; set; }
        public string? Role { get; set; }
        public int? AdresseId { get; set; }
    }
}
