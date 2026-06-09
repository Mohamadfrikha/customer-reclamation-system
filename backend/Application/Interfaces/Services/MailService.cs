using Application.DTOs;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _settings;

        public MailService(IOptions<MailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string username, string tempPassword)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = "Bienvenue - Vos identifiants de connexion";

            email.Body = new TextPart("html")
            {
                Text = $"""
                <h2>Bonjour {username},</h2>
                <p>Votre compte a été créé par l'administrateur.</p>
                <p><b>Email :</b> {toEmail}</p>
                <p><b>Mot de passe temporaire :</b> {tempPassword}</p>
                <p style="color:red;">
                  Vous devez changer votre mot de passe lors de votre première connexion.
                </p>
            """
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.SenderEmail, _settings.Password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
