using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

public partial class Category
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string Nom { get; set; } = null!;

    [InverseProperty("Categorie")]
    public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
}
