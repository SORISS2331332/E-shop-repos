using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineShopApi.DTOS
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Le nom est réquis")]
        [MinLength(3, ErrorMessage = "Le nom  doit contenir au moins 3 caractères.")]
        public string? Nom { get; set; }


        [Required(ErrorMessage = "Le prénom est réquis")]
        [MinLength(3, ErrorMessage = "prénom doit contenir au moins 3 caractères.")]
        public string? Prenom { get; set; }


        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Phone]
        [Required(ErrorMessage = "Phone is required")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        
    }
}