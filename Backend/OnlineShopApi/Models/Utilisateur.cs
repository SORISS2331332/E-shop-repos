using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Models;

public partial class Utilisateur : IdentityUser
{

    [StringLength(100)]
    public string Nom { get; set; } = null!;
    [StringLength(100)]
    public string Prenom { get; set; } = null!;
    public int? AdresseId { get; set; }

    [Column(TypeName = "timestamp")]
    public DateTime? DateInscription { get; set; }

    public string? Photo { get; set; }

    [ForeignKey("AdresseId")]
    [InverseProperty("Utilisateurs")]
    public virtual Adresse? Adresse { get; set; }

    [InverseProperty("Utilisateur")]
    public virtual ICollection<Avi> Avis { get; set; } = new List<Avi>();

    [InverseProperty("Utilisateur")]
    public virtual ICollection<Commande> Commandes { get; set; } = new List<Commande>();


    [InverseProperty("Utilisateur")]
    public virtual ICollection<Panier> Paniers { get; set; } = new List<Panier>();

    [InverseProperty("Utilisateur")]
    public virtual ICollection<Favoris> Favoris { get; set; } = new List<Favoris>();

}
