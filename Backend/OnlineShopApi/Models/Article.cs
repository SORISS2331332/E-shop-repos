using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

public partial class Article
{
    [Key]
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

    [Column(TypeName = "timestamp")]
    public DateTime? DateAjout { get; set; } = DateTime.UtcNow;

    [StringLength(50)]
    public string Statut { get; set; } = "Disponible";

    public int Quantite { get; set; }
    public int Ventes { get; set; } = 0;


    [InverseProperty("Article")]
    public virtual ICollection<Avi> Avis { get; set; } = new List<Avi>();

    [ForeignKey("CategorieId")]
    [InverseProperty("Articles")]
    public virtual Category Categorie { get; set; } = null!;

    [InverseProperty("IdArticleNavigation")]
    public virtual ICollection<CommandeArticle> CommandeArticles { get; set; } = new List<CommandeArticle>();

    [InverseProperty("Article")]
    public virtual ICollection<Image> Images { get; set; } = new List<Image>();

    [InverseProperty("Article")]
    public virtual ICollection<Panier> Paniers { get; set; } = new List<Panier>();
    [InverseProperty("Article")]
    public virtual ICollection<Favoris> Favoris { get; set; } = new List<Favoris>();


}
