using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

[Table("Adresse")]
public partial class Adresse
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string CodeCivique { get; set; } = null!;

    [StringLength(255)]
    public string Rue { get; set; } = null!;

    [StringLength(100)]
    public string Ville { get; set; } = null!;

    [StringLength(100)]
    public string Pays { get; set; } = null!;

    [StringLength(20)]
    public string CodePostal { get; set; } = null!;

    [InverseProperty("Adresse")]
    public virtual ICollection<Utilisateur> Utilisateurs { get; set; } = new List<Utilisateur>();
}
