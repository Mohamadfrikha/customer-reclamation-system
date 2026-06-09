using Domain.Entities;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Application.Interfaces.Services
{
    public class FacturePdfService: IFacturePdfService
    {
        private readonly string _wwwrootPath;

        public FacturePdfService(string wwwrootPath)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            _wwwrootPath = wwwrootPath;
        }

        public string GenererPdf(Facture facture)
        {
            var folder = Path.Combine(_wwwrootPath, "factures");
            Directory.CreateDirectory(folder);

            var fileName = $"facture_{facture.FactureId}.pdf";
            var fullPath = Path.Combine(folder, fileName);

            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Arial"));

                    // ── Header ──
                    page.Header().PaddingBottom(20).Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("FACTURE").FontSize(28).Bold().FontColor("#1a1a2e");
                            col.Item().Text($"N° {facture.FactureId:D6}").FontSize(11).FontColor("#888");
                        });
                        row.ConstantItem(180).Column(col =>
                        {
                            col.Item().AlignRight().Text($"Date : {facture.DateFacture:dd/MM/yyyy}").FontSize(10);
                            col.Item().AlignRight().Text($"Client : {facture.Utilisateur?.LastName} {facture.Utilisateur?.FirstName}").FontSize(10);
                        });
                    });

                    // ── Content ──
                    page.Content().Column(col =>
                    {
                        // Bloc intervention
                        col.Item()
                            .Background("#f8f8f8")
                            .Border(1).BorderColor("#e0e0e0")
                            .Padding(12)
                            .Column(inner =>
                            {
                                inner.Item().Text("Détails de l'intervention").Bold().FontSize(13).FontColor("#1a1a2e");
                                inner.Item().PaddingTop(8).Text($"Date : {facture.InterventionTechnique?.DateIntervention:dd/MM/yyyy}");
                                inner.Item().Text($"Description : {facture.InterventionTechnique?.Description}");
                                inner.Item().Text(
                                    facture.InterventionTechnique?.EstSousGarantie == true
                                        ? "Garantie : Sous garantie constructeur"
                                        : "Garantie : Hors garantie"
                                );
                            });

                        col.Item().PaddingTop(24);

                        // Tableau coûts
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.RelativeColumn(4);
                                cols.RelativeColumn(2);
                            });

                            // Header tableau
                            table.Header(h =>
                            {
                                h.Cell().Background("#1a1a2e").Padding(10)
                                    .Text("Désignation").FontColor("#ffffff").Bold();
                                h.Cell().Background("#1a1a2e").Padding(10).AlignRight()
                                    .Text("Montant (DT)").FontColor("#ffffff").Bold();
                            });

                            // Main d'œuvre
                            table.Cell().BorderBottom(1).BorderColor("#eeeeee").Padding(10)
                                .Text("Main d'œuvre");
                            table.Cell().BorderBottom(1).BorderColor("#eeeeee").Padding(10).AlignRight()
                                .Text($"{facture.CoutMainOeuvre:F2} DT");

                            // Pièces
                            table.Cell().BorderBottom(1).BorderColor("#eeeeee").Padding(10)
                                .Text("Pièces de rechange");
                            table.Cell().BorderBottom(1).BorderColor("#eeeeee").Padding(10).AlignRight()
                                .Text($"{facture.CoutPieces:F2} DT");

                            // Total
                            table.Cell().Background("#f0f0f0").Padding(10)
                                .Text("TOTAL TTC").Bold().FontSize(12);
                            table.Cell().Background("#f0f0f0").Padding(10).AlignRight()
                                .Text($"{facture.MontantTotal:F2} DT").Bold().FontSize(12).FontColor("#1a1a2e");
                        });

                        // Badge gratuit
                        if (facture.InterventionTechnique?.EstGratuite == true)
                        {
                            col.Item().PaddingTop(16)
                                .Background("#e8f5e9").Border(1).BorderColor("#a5d6a7")
                                .Padding(12)
                                .Text("✓ Intervention gratuite — couverte par la garantie constructeur")
                                .FontColor("#2e7d32").Bold();
                        }
                    });

                    // ── Footer ──
                    page.Footer().AlignCenter().Text(t =>
                    {
                        t.Span("SAV System  •  ").FontSize(9).FontColor("#aaa");
                        t.Span($"Généré le {DateTime.Now:dd/MM/yyyy à HH:mm}").FontSize(9).FontColor("#aaa");
                    });
                });
            })
            .GeneratePdf(fullPath);

            return $"/factures/{fileName}";
        }
    }
}
