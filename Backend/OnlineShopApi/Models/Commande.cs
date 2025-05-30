using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

public partial class Commande
{
    [Key]
    public int Id { get; set; }

    public string? UtilisateurId { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? Date { get; set; } = DateTime.UtcNow;

    [StringLength(50)]
    public string Statut { get; set; } = "En cours";

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Montant { get; set; }

    [StringLength(255)]
    public string? AdresseLivraison { get; set; }

    [StringLength(50)]
    public string? ModeLivraison { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? TempsLivraison { get; set; } = DateTime.Now.AddDays(3);

    [InverseProperty("IdCommandeNavigation")]
    public virtual ICollection<CommandeArticle> CommandeArticles { get; set; } = new List<CommandeArticle>();

    [ForeignKey("UtilisateurId")]
    [InverseProperty("Commandes")]
    public virtual Utilisateur Utilisateur { get; set; } = null!;
}
