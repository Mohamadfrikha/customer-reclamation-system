using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class UserDTO
    {
    
        public string Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Adresse { get; set; }
        public string Username { get; set; }

        public List<string> Roles { get; set; }
        public String ImageUrl { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string CIN { get; set; }

        public string PhoneNumber { get; set; }
    }
}
