using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

[PrimaryKey("IdCommande", "IdArticle")]
[Table("CommandeArticle")]
public partial class CommandeArticle
{
    [Key]
    public int IdCommande { get; set; }

    [Key]
    public int IdArticle { get; set; }

    public int Quantite { get; set; }


    [ForeignKey("IdArticle")]
    [InverseProperty("CommandeArticles")]
    public virtual Article IdArticleNavigation { get; set; } = null!;

    [ForeignKey("IdCommande")]
    [InverseProperty("CommandeArticles")]
    public virtual Commande IdCommandeNavigation { get; set; } = null!;
}
