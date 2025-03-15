using Gym.Interfaces;
using Gym.Models.Common;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace Gym.Services;

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtpSettings;

    public EmailService(IOptions<SmtpSettings> smtpSettings)
    {
        _smtpSettings = smtpSettings.Value;
    }

    public void SendEmailWithTemplate(string toEmail, string subject, string templateName, Dictionary<string, string> placeholders)
    {
        var templatePath = Path.Combine("Templates", templateName);
        var emailTemplate = File.ReadAllText(templatePath);

        if (placeholders != null)
        {
            foreach (var placeholder in placeholders)
            {
                emailTemplate = emailTemplate.Replace(placeholder.Key, placeholder.Value);
            }
        }

        SendEmail(toEmail, subject, emailTemplate);
    }

    public void SendGeneralEmail(string paraEmail, string titulo, string descricao, string portalLink)
    {
        var emailTemplate = File.ReadAllText("Templates/NotificacaoEmailTemplate.html");
        emailTemplate = emailTemplate.Replace("{{TITULO}}", titulo)
                                     .Replace("{{DESCRICAO}}", descricao)
                                     .Replace("{{PORTAL_LINK}}", portalLink);

        SendEmail(paraEmail, "GYM Notification", emailTemplate);
    }

    public void SendPasswordResetEmail(string toEmail, string tempPassword)
    {
        var emailTemplate = File.ReadAllText("Templates/PasswordRecoveryTemplate.html");
        emailTemplate = emailTemplate.Replace("{{TEMP_PASSWORD}}", tempPassword);

        SendEmail(toEmail, "Recover Password", emailTemplate);
    }

    public void SendAccountConfirmationEmail(string toEmail, string confirmationUrl)
    {
        var emailTemplate = File.ReadAllText("Templates/AccountConfirmationTemplate.html");
        emailTemplate = emailTemplate.Replace("{{CONFIRMATION_LINK}}", confirmationUrl);

        SendEmail(toEmail, "Confirm Account", emailTemplate);
    }
    private void SendEmail(string toEmail, string subject, string body)
    {
        var mailMessage = new MailMessage
        {
            From = new MailAddress(_smtpSettings.Username, "GYM"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(toEmail);

        using var smtpClient = new SmtpClient(_smtpSettings.Host, _smtpSettings.Port)
        {
            Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password),
            EnableSsl = true
        };

        smtpClient.Send(mailMessage);
    }
}
