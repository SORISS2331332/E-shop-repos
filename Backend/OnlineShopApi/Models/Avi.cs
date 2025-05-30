using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

public partial class Avi
{
    [Key]
    public int Id { get; set; }

    public string? UtilisateurId { get; set; }

    public int ArticleId { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? Date { get; set; }

    public int Note { get; set; }

    [StringLength(1000)]
    public string? Commentaire { get; set; }

    [ForeignKey("ArticleId")]
    [InverseProperty("Avis")]
    public virtual Article Article { get; set; } = null!;

    [ForeignKey("UtilisateurId")]
    [InverseProperty("Avis")]
    public virtual Utilisateur Utilisateur { get; set; } = null!;
}
