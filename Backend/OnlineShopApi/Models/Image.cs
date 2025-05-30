using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

public partial class Image
{
    [Key]
    public int Id { get; set; }

    public int ArticleId { get; set; }

    [StringLength(255)]
    public string Lien { get; set; } = null!;

    [ForeignKey("ArticleId")]
    [InverseProperty("Images")]
    public virtual Article Article { get; set; } = null!;
}
