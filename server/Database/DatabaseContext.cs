using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Database
{
    public class DatabaseContext :DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options)
            : base(options)
        {
        }

        public DbSet<Bill> Bills { get; set; }
        public DbSet<SpecialRechargePackage> SpecialRechargePackages { get; set; }
        public DbSet<BillSpecialRechargePackage> BillSpecialRechargePackages { get; set; }
        public DbSet<BillSpecialServicePackage> BillSpecialServicePackages { get; set; }
        public DbSet<SpecialServicePackage> SpecialServicePackages { get; set; }
        public DbSet<TopUpPackage> TopUpPackages { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FeedbackMessage> FeedbackMessages { get; set; }
        public DbSet<VertifyPhoneData> VertifyPhoneDatas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.PhoneNumber)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Bill>() 
                .Property(b => b.TopUpId)
                .IsRequired(false);

            modelBuilder.Entity<Bill>()
                .Property(b => b.CreatedDate);

            modelBuilder.Entity<Transaction>()
                .HasMany(t => t.Bills)
                .WithOne(b => b.Transaction)
                .HasForeignKey(b => b.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BillSpecialRechargePackage>()
                .HasKey(x => new { x.BillId, x.SpecialRechargeId });

            modelBuilder.Entity<BillSpecialRechargePackage>()
                .HasOne(x => x.Bill)
                .WithMany(b => b.BillSpecialRechargePackages)
                .HasForeignKey(x => x.BillId);

            modelBuilder.Entity<BillSpecialRechargePackage>()
                .HasOne(x => x.SpecialRechargePackage)
                .WithMany(s => s.BillSpecialRechargePackages)
                .HasForeignKey(x => x.SpecialRechargeId);

            modelBuilder.Entity<BillSpecialServicePackage>()
                .HasKey(x => new { x.BillId, x.SpecialServiceId });

            modelBuilder.Entity<BillSpecialServicePackage>()
                .HasOne(x => x.Bill)
                .WithMany(b => b.BillSpecialServicePackages)
                .HasForeignKey(x => x.BillId);

            modelBuilder.Entity<BillSpecialServicePackage>()
                .HasOne(x => x.SpecialServicePackage)
                .WithMany(s => s.BillSpecialServicePackages)
                .HasForeignKey(x => x.SpecialServiceId);

            modelBuilder.Entity<Feedback>()
                .HasMany(t => t.Messages)
                .WithOne(m => m.Feedback)
                .HasForeignKey(m => m.FeedbackId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VertifyPhoneData>()
                .HasIndex(v => v.PhoneNumber)
                .IsUnique();
        }
    }
}
