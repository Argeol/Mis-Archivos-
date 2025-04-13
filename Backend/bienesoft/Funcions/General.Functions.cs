// using Bienesoft.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.IO;
using bienesoft.Models;

namespace bienesoft.Funcions
{
    public class GeneralFunction
    {
        public ConfigServer configServer { get; set; }

        public GeneralFunction(IConfiguration configuration)
        {
            configServer = configuration.GetSection("ConfigServerEmail").Get<ConfigServer>();
        }

        public async Task<ResponseSend> SendEmail(string emailDestination, string resetLink)
        {
            ResponseSend response = new ResponseSend();
            try
            {
                using (SmtpClient smtpClient = new SmtpClient(configServer.HostName, configServer.PortHost))
                {
                    smtpClient.Credentials = new NetworkCredential(configServer.Email, configServer.Password);
                    smtpClient.EnableSsl = true; // Asegúrate de que tu servidor SMTP soporta SSL/TLS

                    MailAddress remitente = new MailAddress(configServer.Email, "Bienesoft", Encoding.UTF8);
                    MailAddress destinatario = new MailAddress(emailDestination);

                    using (MailMessage message = new MailMessage(remitente, destinatario))
                    {
                        message.IsBodyHtml = true;
                        message.Subject = "🔑 Restablecimiento de Contraseña";
                        message.Body = GenerateEmailBody(resetLink);
                        message.BodyEncoding = Encoding.UTF8;

                        await smtpClient.SendMailAsync(message);
                    }
                }

                response.Message = "Correo enviado exitosamente";
                response.Status = true;
            }
            catch (Exception ex)
            {
                Addlog($"Error al enviar correo: {ex}");
                response.Message = ex.Message;
                response.Status = false;
            }
            return response;
        }

        /// <summary>
        /// Genera el cuerpo HTML del correo con el enlace de restablecimiento.
        /// </summary>
        private string GenerateEmailBody(string resetLink)
        {
            return $@"
                <html>
                <body style='font-family: Arial, sans-serif; text-align: center;'>
                    <h2>Restablecimiento de Contraseña</h2>
                    <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                    <p>Para continuar, haz clic en el siguiente botón:</p>
                    <p>
                        <a href='{resetLink}' 
                           style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;'>
                            Restablecer Contraseña
                        </a>
                    </p>
                    <p>O copia y pega este enlace en tu navegador:</p>
                    <p><a href='{resetLink}'>{resetLink}</a></p>
                    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                    <p><strong>Bienesoft</strong></p>
                </body>
                </html>";
        }

        public void Addlog(string newLog)
        {
            string logDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "logs");
            if (!Directory.Exists(logDirectory))
            {
                Directory.CreateDirectory(logDirectory);
            }
            string logFilePath = Path.Combine(logDirectory, DateTime.Now.ToString("dd-MM-yyyy") + ".log");
            var registro = $"{DateTime.Now} - {newLog}\n";
            File.AppendAllText(logFilePath, registro, Encoding.UTF8);
        }

        public string[] ValidModel(dynamic collection)
        {
            List<string> errors = new List<string>();
            foreach (var item in collection)
            {
                if (string.IsNullOrEmpty(item))
                {
                    errors.Add("El campo está vacío");
                }
            }
            return errors.ToArray();
        }
        public async Task<ResponseSend> SendWelcomeEmail(string emailDestination, string plainPassword)
        {
            ResponseSend response = new ResponseSend();
            try
            {
                using (SmtpClient smtpClient = new SmtpClient(configServer.HostName, configServer.PortHost))
                {
                    smtpClient.Credentials = new NetworkCredential(configServer.Email, configServer.Password);
                    smtpClient.EnableSsl = true;

                    MailAddress remitente = new MailAddress(configServer.Email, "Bienesoft", Encoding.UTF8);
                    MailAddress destinatario = new MailAddress(emailDestination);

                    using (MailMessage message = new MailMessage(remitente, destinatario))
                    {
                        message.IsBodyHtml = true;
                        message.Subject = "👋 Bienvenido a Bienesoft";
                        message.Body = GenerateWelcomeEmailBody(plainPassword);
                        message.BodyEncoding = Encoding.UTF8;

                        await smtpClient.SendMailAsync(message);
                    }
                }

                response.Message = "Correo de bienvenida enviado";
                response.Status = true;
            }
            catch (Exception ex)
            {
                Addlog($"Error al enviar correo de bienvenida: {ex}");
                response.Message = ex.Message;
                response.Status = false;
            }

            return response;
        }
        private string GenerateWelcomeEmailBody(string password)
        {
            return $@"
        <html>
        <body style='font-family: Arial, sans-serif; text-align: center;'>
            <h2>¡Bienvenido a Bienesoft!</h2>
            <p>Tu cuenta ha sido registrada exitosamente.</p>
            <p><strong>Contraseña temporal:</strong> {password}</p>
            <p>Por seguridad, te recomendamos cambiarla al iniciar sesión.</p>
            <br />
            <p>Gracias por confiar en <strong>Bienesoft</strong>.</p>
        </body>
        </html>";
        }

    }
}
