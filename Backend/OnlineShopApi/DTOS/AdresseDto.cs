using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class AdresseDto
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string CodeCivique { get; set; } = null!;

        [StringLength(255)]
        public string Rue { get; set; } = null!;

        [StringLength(100)]
        public string Ville { get; set; } = null!;

        [StringLength(100)]
        public string Pays { get; set; } = null!;

        [StringLength(20)]
        public string CodePostal { get; set; } = null!;
    }
}
