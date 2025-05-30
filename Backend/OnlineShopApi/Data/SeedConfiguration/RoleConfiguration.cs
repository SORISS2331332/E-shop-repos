using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Data.SeedConfiguration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(

            new IdentityRole
            {
                Name = "Client",
                NormalizedName = "CLIENT"
            },
            new IdentityRole
            {
                Name = "Admin",
                NormalizedName = "ADMIN"
            }
            );
        }
    }
}
