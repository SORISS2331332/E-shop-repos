using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.Models
{
    [Table("Favoris")]
    public partial class Favoris
    {
        [Key]
        public int Id { get; set; }

        public string? UtilisateurId { get; set; }

        public int ArticleId { get; set; }

        [ForeignKey("ArticleId")]
        [InverseProperty("Favoris")]
        public virtual Article Article { get; set; } = null!;

        [ForeignKey("UtilisateurId")]
        [InverseProperty("Favoris")]
        public virtual Utilisateur Utilisateur { get; set; } = null!;
    }
}
