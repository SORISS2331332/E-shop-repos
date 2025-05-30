namespace OnlineShopApi.DTOS
{
    public class PanierDto
    {
        public int Id { get; set; }

        public string? UtilisateurId { get; set; }

        public int ArticleId { get; set; }

        public int Quantite { get; set; }
    }
}
