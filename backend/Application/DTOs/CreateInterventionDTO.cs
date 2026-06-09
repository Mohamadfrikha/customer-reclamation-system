using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CreateInterventionDTO
    {
        [Required]
        public int ReclamationId { get; set; }
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public double CoutMainOeuvre { get; set; }
        public double CoutPieces { get; set; }
        public bool EstSousGarantie { get; set; }
    }
}
