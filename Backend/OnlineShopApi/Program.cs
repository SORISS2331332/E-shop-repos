
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OnlineShopApi.Auth;
using OnlineShopApi.Data;
using OnlineShopApi.Data.SeedConfiguration;
using OnlineShopApi.Models;
using System.Text;

namespace OnlineShopApi
{
    public class Program
    {
        public static  void Main(string[] args)
        {
            
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<EcommerceContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("EcommerceContext") ?? throw new InvalidOperationException("Connection string 'EcommerceContext' not found.")));
            // Add services to the container.
            // For Identity
            builder.Services.AddIdentityCore<Utilisateur>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<EcommerceContext>()
            .AddDefaultTokenProviders();
            // Adding Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })

            // Adding Jwt Bearer
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:Audience"],
                    ValidIssuer = builder.Configuration["JWT:Issuer"],
                    IssuerSigningKey = new
    SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
                };
            });
            builder.Services.AddAuthorization(options =>
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
            });
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IAuthManager, AuthManager>();
            builder.Services.AddAutoMapper(typeof(AutoMapperConfig));


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                
                });
            });


            var app = builder.Build();
            

            // Configure the HTTP request pipeline.

            app.UseSwagger();
            app.UseSwaggerUI();
            

            app.UseHttpsRedirection(); 
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();
            
            
            app.MapControllers();
            
            app.Run();
        }
    }
}
