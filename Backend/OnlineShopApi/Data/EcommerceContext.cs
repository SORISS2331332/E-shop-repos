using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OnlineShopApi.Models;
using OnlineShopApi.Data.SeedConfiguration;

namespace OnlineShopApi.Data;

public partial class EcommerceContext : IdentityDbContext<Utilisateur>
{
   

    public EcommerceContext(DbContextOptions<EcommerceContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Adresse> Adresses { get; set; }

    public virtual DbSet<Article> Articles { get; set; }

    public virtual DbSet<Avi> Avis { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Commande> Commandes { get; set; }

    public virtual DbSet<CommandeArticle> CommandeArticles { get; set; }

    public virtual DbSet<Image> Images { get; set; }


    public virtual DbSet<Panier> Paniers { get; set; }


    public virtual DbSet<Favoris> Favoris { get; set; }




    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Adresse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Adresse__3214EC0756FAF25A");
        });

        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Articles__3214EC075D233E25");

            entity.Property(e => e.DateAjout)
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.Statut).HasDefaultValue("Disponible");

            entity.Property(e => e.Ventes).HasDefaultValue(0);
            entity.HasOne(d => d.Categorie).WithMany(p => p.Articles)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Articles_Categories");
        });

        modelBuilder.Entity<Avi>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Avis__3214EC0753E1762D");

            entity.Property(e => e.Date).HasColumnType("timestamp with time zone")
          .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Article).WithMany(p => p.Avis)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Avis_Articles");

            entity.HasOne(d => d.Utilisateur).WithMany(p => p.Avis)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Avis_Utilisateurs");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC072E2E6CB0");
        });

        modelBuilder.Entity<Commande>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Commande__3214EC07CA9F09E3");

            entity.Property(e => e.Date).HasColumnType("timestamp with time zone").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.TempsLivraison).HasColumnType("timestamp with time zone").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Utilisateur).WithMany(p => p.Commandes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Commandes_Utilisateurs");
        });

        modelBuilder.Entity<CommandeArticle>(entity =>
        {
            entity.HasKey(e => new { e.IdCommande, e.IdArticle }).HasName("PK__Commande__3AE43C72B76E3763");

            entity.ToTable("CommandeArticle", tb =>
                {
                    tb.HasTrigger("trg_AfterInsert_CommandeArticle");
                    tb.HasTrigger("trg_BeforeInsert_CommandeArticle");
                });

            entity.HasOne(d => d.IdArticleNavigation).WithMany(p => p.CommandeArticles)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CommandeArticle_Articles");

            entity.HasOne(d => d.IdCommandeNavigation).WithMany(p => p.CommandeArticles)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CommandeArticle_Commandes");
        });

        modelBuilder.Entity<Image>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Images__3214EC07725D9907");

            entity.HasOne(d => d.Article).WithMany(p => p.Images)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Images_Articles");
        });

       

       

        modelBuilder.Entity<Panier>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Panier__3214EC076BB20E90");

            entity.HasOne(d => d.Article).WithMany(p => p.Paniers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Panier_Articles");

            entity.HasOne(d => d.Utilisateur).WithMany(p => p.Paniers)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Panier_Utilisateurs");
        });

        modelBuilder.Entity<Favoris>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Favoris__3214EC076BB20E90");

            entity.HasOne(d => d.Article).WithMany(p => p.Favoris)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favoris_Articles");

            entity.HasOne(d => d.Utilisateur).WithMany(p => p.Favoris)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Favoris_Utilisateurs");
        });

        modelBuilder.Entity<Utilisateur>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Utilisat__3214EC07F8B396EC");

            entity.Property(e => e.DateInscription).HasColumnType("timestamp with time zone").HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.Adresse).WithMany(p => p.Utilisateurs).HasConstraintName("FK_Utilisateurs_Adresse");

           
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
