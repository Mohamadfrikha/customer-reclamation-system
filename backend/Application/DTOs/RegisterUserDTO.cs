using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class RegisterUserDTO
    {
        [StringLength(100)]
        public string FirstName { get; set; }

        [StringLength(100)]
        public string LastName { get; set; }

        [StringLength(128)]
        public string Adresse { get; set; }

        [StringLength(50)]
        public string Username { get; set; }

        [StringLength(128)]
        public string Email { get; set; }

        [StringLength(256)]
        public string Password { get; set; }

        [Required(ErrorMessage = "CIN est obligatoire")]
        [RegularExpression(@"^\d{8}$", ErrorMessage = "CIN doit contenir exactement 8 chiffres")]
        public string CIN { get; set; }

        [Required(ErrorMessage = "Téléphone obligatoire")]
        [RegularExpression(@"^\d{8}$", ErrorMessage = "Téléphone doit contenir 8 chiffres")]
        public string PhoneNumber { get; set; }


    }
}
