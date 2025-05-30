using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class CommandeArticleDto
    {
        public int IdCommande { get; set; }

        public int IdArticle { get; set; }

        public int Quantite { get; set; }
    }
}
