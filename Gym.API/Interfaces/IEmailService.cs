namespace Gym.Interfaces
{
    public interface IEmailService
    {
        void SendEmailWithTemplate(string toEmail, string subject, string templateName, Dictionary<string, string> placeholders);
        void SendGeneralEmail(string paraEmail, string titulo, string descricao, string portalLink);
        void SendPasswordResetEmail(string toEmail, string tempPassword);
        void SendAccountConfirmationEmail(string toEmail, string confirmationUrl);
    }
}
