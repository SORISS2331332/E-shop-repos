using AutoMapper;
using OnlineShopApi.DTOS;
using OnlineShopApi.Models;

namespace OnlineShopApi.Data.SeedConfiguration
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<Article, ArticleDto>().ReverseMap();
            CreateMap<Article, GetArticleDto>().ReverseMap();
            CreateMap<Adresse, AdresseDto>().ReverseMap();
            CreateMap<Category, CategorieDto>().ReverseMap();
            CreateMap<Avi, AviDto>().ReverseMap();
            CreateMap<Avi, GetAviDto>().ReverseMap();
            CreateMap<Image, ImageDto>().ReverseMap();
            CreateMap<CommandeArticle, CommandeArticleDto>().ReverseMap();
            CreateMap<Commande, CommandeDto>().ReverseMap();
            CreateMap<Utilisateur, UtilisateurDto>().ReverseMap();
            CreateMap<Utilisateur, GetUserDto>().ReverseMap();
            CreateMap<Panier, PanierDto>().ReverseMap();
            CreateMap<Favoris, FavorisDto>().ReverseMap();
        }
    }
}
