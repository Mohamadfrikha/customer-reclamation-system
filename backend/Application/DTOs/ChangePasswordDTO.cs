using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class ChangePasswordDTO
    {
        public string Email { get; set; }
        public string TempPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
