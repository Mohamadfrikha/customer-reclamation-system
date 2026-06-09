using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace GestionSAV.Data
{
    public class AppDbContext : IdentityDbContext<Utilisateur>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Categorie> Categories { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<ArticleClient> ArticleClients { get; set; }
        public DbSet<Reclamation> Reclamations { get; set; }
        public DbSet<InterventionTechnique> InterventionsTechniques { get; set; }
        public DbSet<Facture> Factures { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Utilisateur → ArticleClient (1 à *)
            modelBuilder.Entity<ArticleClient>()
                .HasOne(ac => ac.Utilisateur)
                .WithMany(u => u.ArticleClients)
                .HasForeignKey(ac => ac.UtilisateurId)
                .OnDelete(DeleteBehavior.Restrict);

            // Article → ArticleClient (1 à *)
            modelBuilder.Entity<ArticleClient>()
                .HasOne(ac => ac.Article)
                .WithMany(a => a.ArticleClients)
                .HasForeignKey(ac => ac.ArticleId)
                .OnDelete(DeleteBehavior.Restrict);

            // ArticleClient → Reclamation (1 à *)
            modelBuilder.Entity<Reclamation>()
                .HasOne(r => r.ArticleClient)
                .WithMany(ac => ac.Reclamations)
                .HasForeignKey(r => r.ArticleClientId)
                .OnDelete(DeleteBehavior.NoAction);

            // Reclamation → InterventionTechnique (1 à 0..1)
            modelBuilder.Entity<InterventionTechnique>()
                .HasOne(i => i.Reclamation)
                .WithOne(r => r.InterventionTechnique)
                .HasForeignKey<InterventionTechnique>(i => i.ReclamationId)
                .OnDelete(DeleteBehavior.Restrict);

            // InterventionTechnique → Facture (1 à 0..1)
            modelBuilder.Entity<Facture>()
                .HasOne(f => f.InterventionTechnique)
                .WithOne(i => i.Facture)
                .HasForeignKey<Facture>(f => f.InterventionTechniqueId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Facture>()
            .HasOne(f => f.Utilisateur)
            .WithMany(u => u.Factures)
            .HasForeignKey(f => f.UtilisateurId)
            .OnDelete(DeleteBehavior.Restrict);

            // Categorie → Article (1 à *)
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Categorie)
                .WithMany(c => c.Articles)
                .HasForeignKey(a => a.CategorieId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Article>()
            .HasIndex(a => a.Reference)
            .IsUnique();
            modelBuilder.Entity<Article>()
            .Property(a => a.Prix)
            .HasPrecision(18, 2);

            modelBuilder.Entity<Article>()
                .Property(a => a.PrixPromo)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Reclamation>()
                .HasOne(r => r.Utilisateur)
                .WithMany(u => u.Reclamations)
                .HasForeignKey(r => r.UtilisateurId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Utilisateur>()
                 .HasIndex(u => u.CIN)
                 .IsUnique()
                 .HasFilter("[CIN] IS NOT NULL AND [CIN] <> ''");
        }
    }
}
