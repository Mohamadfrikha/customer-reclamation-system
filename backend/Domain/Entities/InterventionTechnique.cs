namespace Domain.Entities   
{
    public class InterventionTechnique
    {
        public int InterventionTechniqueId { get; set; }
        public DateTime DateIntervention { get; set; }
        public string Description { get; set; } = string.Empty;
        public double CoutMainOeuvre { get; set; }
        public double CoutPieces { get; set; }
        public bool EstSousGarantie { get; set; } // Le responsable SAV vérifie et décide
        public bool EstGratuite { get; set; }      // Calculé à partir de EstSousGarantie

        // FK
        public int ReclamationId { get; set; }
        public Reclamation? Reclamation { get; set; }

        // Navigation
        public Facture? Facture { get; set; }

        // Méthode métier
        public void CalculerGratuite()
        {
            EstGratuite = EstSousGarantie;
            if (EstGratuite)
            {
                CoutMainOeuvre = 0;
                CoutPieces = 0;
            }
        }
    }
}
