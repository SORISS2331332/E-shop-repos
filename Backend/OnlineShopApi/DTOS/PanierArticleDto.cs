namespace OnlineShopApi.DTOS
{
    public class PanierArticleDto
    {
        public int ArticleId { get; set; }
        public string? Nom { get; set; }
        public decimal Prix { get; set; }
        public int Quantite { get; set; }
        public string? Image { get; set; }
    }

}
