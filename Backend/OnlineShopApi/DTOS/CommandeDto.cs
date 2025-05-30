using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OnlineShopApi.DTOS
{
    public class CommandeDto
    {
        public int Id { get; set; }


        public string? UtilisateurId { get; set; }

        public DateTime? Date { get; set; } 

        [StringLength(50)]
        public string? Statut { get; set; } 

        public decimal Montant { get; set; }

        [StringLength(255)]
        public string? AdresseLivraison { get; set; }

        [StringLength(50)]
        public string? ModeLivraison { get; set; }

        public DateTime? TempsLivraison { get; set; } 


    }
}
