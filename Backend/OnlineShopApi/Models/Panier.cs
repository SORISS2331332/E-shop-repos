using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

[Table("Panier")]
public partial class Panier
{
    [Key]
    public int Id { get; set; }

    public string? UtilisateurId { get; set; }

    public int ArticleId { get; set; }

    public int Quantite { get; set; }

    [ForeignKey("ArticleId")]
    [InverseProperty("Paniers")]
    public virtual Article Article { get; set; } = null!;

    [ForeignKey("UtilisateurId")]
    [InverseProperty("Paniers")]
    public virtual Utilisateur Utilisateur { get; set; } = null!;
}
