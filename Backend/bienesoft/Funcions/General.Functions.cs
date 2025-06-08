// using Bienesoft.Models;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.IO;
using bienesoft.Models;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using DocumentFormat.OpenXml.ExtendedProperties;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using System;

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
                        message.Subject = "Restablecimiento de Contraseña";
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
            string imageUrl = "https://i.imgur.com/BChB7mV.png";

            return $@"
<!DOCTYPE html>
<html lang=""es"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Restablecimiento de Contraseña</title>
    <!--[if mso]>
    <style type=""text/css"">
        table, td, div, h1, p {{font-family: Arial, sans-serif !important;}}
    </style>
    <![endif]-->
</head>
<body style=""margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; color: #333333;"">
    <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" width=""100%"" style=""max-width: 650px; margin: 20px auto;"">
        <tr>
            <td style=""background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 30px 0; text-align: center; border-radius: 12px 12px 0 0;"">
                <h1 style=""color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);"">Restablecimiento de Contraseña</h1>
            </td>
        </tr>
        <tr>
            <td style=""background-color: #ffffff; padding: 0; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;"">
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 40px 40px 20px; text-align: center;"">
                            <img src=""{imageUrl}"" alt=""Logo de Bienesoft"" style=""max-width: 200px; height: auto; margin-bottom: 25px;"" />
                            <h2 style=""color: #2c3e50; margin: 0 0 15px; font-size: 22px; font-weight: 600;"">¡Hola!</h2>                          
                            <p style=""color: #5d6778; font-size: 16px; line-height: 1.6; margin: 0 0 20px;"">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong style=""color: #4a6cf7;"">Bienesoft</strong>.</p>
                        </td>
                    </tr>
                </table>
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 0 40px 30px;"">
                            <div style=""background-color: #f8f9fa; border-left: 4px solid #4a6cf7; padding: 15px; border-radius: 4px;"">
                                <p style=""color: #2c3e50; font-size: 16px; line-height: 1.6; margin: 0;"">Para continuar con el proceso de restablecimiento, haz clic en el botón de abajo:</p>
                            </div>
                        </td>
                    </tr>
                </table>
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 0 40px 30px; text-align: center;"">
                            <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" style=""margin: 0 auto;"">
                                <tr>
                                    <td style=""border-radius: 50px; background: linear-gradient(to right, #4a6cf7, #6a11cb); box-shadow: 0 5px 15px rgba(106, 17, 203, 0.3);"">
                                        <a href=""{resetLink}"" target=""_blank"" style=""display: inline-block; padding: 15px 35px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 50px;""> Restablecer Contraseña</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 0 40px 20px;"">
                            <p style=""color: #5d6778; font-size: 14px; margin: 0 0 10px;"">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                            <div style=""background-color: #f0f4f8; padding: 12px; border-radius: 6px; border: 1px dashed #c0d6e8;"">
                                <p style=""word-break: break-all; font-size: 14px; font-family: monospace; margin: 0; color: #4a6cf7;"">{resetLink}</p>
                            </div>
                        </td>
                    </tr>
                </table>
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 0 40px 40px;"">
                            <div style=""background-color: #fff8f0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px;"">
                                <p style=""color: #e67e22; font-size: 14px; line-height: 1.6; margin: 0;"">
                                    <strong>Nota de seguridad:</strong> Si no solicitaste este cambio, te recomendamos cambiar tu contraseña inmediatamente o contactar con nuestro equipo de soporte.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style=""background-color: #f8f9fa; padding: 30px 40px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;"">
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""text-align: center;"">
                            <h3 style=""color: #2c3e50; margin: 0 0 15px; font-size: 18px; font-weight: 600;"">¿Necesitas ayuda?</h3>
                            <p style=""color: #5d6778; font-size: 15px; line-height: 1.6; margin: 0 0 15px;"">
                                Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style=""background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%); padding: 25px 40px; text-align: center; border-radius: 0 0 12px 12px;"">
                <p style=""color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0 0 10px;"">
                    &copy; {DateTime.Now.Year} Bienesoft. Todos los derechos reservados.
                </p>
                <p style=""color: rgba(255, 255, 255, 0.8); font-size: 13px; margin: 0;"">
                    Espinal - Tolima
                </p>
                <p style=""font - size:12px; color:#999;"">Este mensaje fue enviado automáticamente por Bienesoft. Si recibiste este correo por error, ignóralo.</p>
            </td>
        </tr>
    </table>
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
            string imageUrl = "https://i.imgur.com/BChB7mV.png";

            return $@"
<!DOCTYPE html>
<html lang=""es"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Tu nueva contraseña</title>
    <!--[if mso]>
    <style type=""text/css"">
        table, td, div, h1, p {{ font-family: Arial, sans-serif !important; }}
    </style>
    <![endif]-->
</head>
<body style=""margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8; color: #333333;"">
    <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" width=""100%"" style=""max-width: 650px; margin: 20px auto;"">
        <tr>
            <td style=""background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #2989d8 100%); padding: 30px 0 15px; text-align: center; border-radius: 12px 12px 0 0;"">
                <h1 style=""color: #ffffff; margin: 0 0 20px; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);"">¡Bienvenido a Bienesoft!</h1>               
            </td>
        </tr>

        <tr>
            <td style=""background-color: #ffffff; padding: 0; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;"">
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 40px 40px 20px; text-align: center;"">
                             <img src=""{imageUrl}"" alt=""Logo de Bienesoft"" style=""max-width: 200px; height: auto; margin-bottom: 15px;"" />
                            <h2 style=""color: #2c3e50; margin: 0 0 15px; font-size: 22px; font-weight: 600;"">¡Tu cuenta ha sido creada con éxito!</h2>
                            <p style=""color: #5d6778; font-size: 16px; line-height: 1.6; margin: 0 0 20px;"">Gracias por unirte a <strong style=""color: #1e3c72;"">Bienesoft</strong>. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
                        </td>
                    </tr>
                </table>

                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 0 40px 30px;"">
                            <div style=""background: linear-gradient(to right, #f9f9f9, #f0f4f8); border-left: 4px solid #1e3c72; padding: 20px; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.05);"">
                                <h3 style=""color: #2c3e50; margin: 0 0 15px; font-size: 18px; font-weight: 600; text-align: center;"">Tu contraseña temporal</h3>
                                <div style=""background-color: #ffffff; border: 2px dashed #2989d8; padding: 15px; border-radius: 6px; text-align: center; margin: 0 auto; max-width: 300px;"">
                                    <p style=""font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1e3c72; margin: 0;"">{password}</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>

                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 0 40px 30px;"">
                            <h3 style=""color: #2c3e50; margin: 0 0 15px; font-size: 18px; font-weight: 600;"">Próximos pasos:</h3>
                            <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                                <tr>
                                    <td width=""40"" valign=""top"">
                                        <div style=""background-color: #e7f1ff; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold; color: #1e3c72;"">1</div>
                                    </td>
                                    <td style=""padding-left: 10px;"">
                                        <p style=""color: #5d6778; font-size: 16px; line-height: 1.6; margin: 0;"">Inicia sesión con tu correo electrónico y la contraseña temporal proporcionada.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width=""40"" valign=""top"">
                                        <div style=""background-color: #e7f1ff; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold; color: #1e3c72;"">2</div>
                                    </td>
                                    <td style=""padding-left: 10px;"">
                                        <p style=""color: #5d6778; font-size: 16px; line-height: 1.6; margin: 0;"">Cambia tu contraseña temporal por una contraseña personal segura.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width=""40"" valign=""top"">
                                        <div style=""background-color: #e7f1ff; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold; color: #1e3c72;"">3</div>
                                    </td>
                                    <td style=""padding-left: 10px;"">
                                        <p style=""color: #5d6778; font-size: 16px; line-height: 1.6; margin: 0;"">Ya estás listo para gestionar los permisos y utilizar todas las funcionalidades del sistema.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""padding: 0 40px 40px;"">
                            <div style=""background-color: #fff8f0; border-left: 4px solid #ff9800; padding: 15px; border-radius: 4px;"">
                                <p style=""color: #e67e22; font-size: 14px; line-height: 1.6; margin: 0;"">
                                    <strong>Consejo de seguridad:</strong> Protege tu cuenta manteniendo tu contraseña solo para ti. Nuestro equipo no solicitará tu contraseña bajo ninguna circunstancia.
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style=""background-color: #f8f9fa; padding: 30px 40px; border-left: 1px solid #e0e0e0; border-right: 1px solid #e0e0e0;"">
                <table role=""presentation"" cellspacing=""0"" cellpadding=""0"" border=""0"" width=""100%"">
                    <tr>
                        <td style=""text-align: center;"">
                            <h3 style=""color: #2c3e50; margin: 0 0 15px; font-size: 18px; font-weight: 600;"">¿Necesitas ayuda?</h3>
                            <p style=""color: #5d6778; font-size: 15px; line-height: 1.6; margin: 0 0 15px;"">
                                Si tienes alguna pregunta o necesitas asistencia, nuestro equipo de soporte está listo para ayudarte.
                            </p>
                            <a href=""mailto:bienesoft5@gmail.com"" style=""color: #1e3c72; text-decoration: none; font-weight: 600;"">soporte@bienesoft.com</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style=""background: linear-gradient(135deg, #2989d8 0%, #1e3c72 100%); padding: 25px 40px; text-align: center; border-radius: 0 0 12px 12px;"">
                <p style=""color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0 0 10px;"">
                    &copy; {DateTime.Now.Year} Bienesoft. Todos los derechos reservados.
                </p>
                <p style=""color: rgba(255, 255, 255, 0.8); font-size: 13px; margin: 0;"">
                    Espinal - Tolima
                </p>
                <p style=""font - size:12px; color:#999;"">Este mensaje fue enviado automáticamente por Bienesoft. Si recibiste este correo por error, ignóralo.
                </p>
            </ td >
        </ tr >
    </ table >
</ body >
</ html >

";
        }
        public async Task<ResponseSend> NotifyResponsibleAsync(string emailDestino, string nombreRol, string nombreAprendiz)
        {
            ResponseSend response = new ResponseSend();
            try
            {
                using (SmtpClient smtpClient = new SmtpClient(configServer.HostName, configServer.PortHost))
                {
                    smtpClient.Credentials = new NetworkCredential(configServer.Email, configServer.Password);
                    smtpClient.EnableSsl = true;

                    MailAddress remitente = new MailAddress(configServer.Email, "Bienesoft", Encoding.UTF8);
                    MailAddress destinatario = new MailAddress(emailDestino);

                    using (MailMessage message = new MailMessage(remitente, destinatario))
                    {
                        message.IsBodyHtml = true;
                        message.Subject = $"Permiso pendiente por revisar - Rol: {nombreRol}";
                        message.Body = GenerateApprovalBody(nombreRol, nombreAprendiz);
                        message.BodyEncoding = Encoding.UTF8;

                        await smtpClient.SendMailAsync(message);
                    }
                }

                response.Message = "Correo enviado exitosamente al responsable";
                response.Status = true;
            }
            catch (Exception ex)
            {
                Addlog($"Error al notificar al responsable: {ex}");
                response.Message = ex.Message;
                response.Status = false;
            }

            return response;
        }
        private string GenerateApprovalBody(string nombreRol, string nombreAprendiz)
        {
            return $@"
        <h2>Notificación de Permiso Pendiente</h2>
        <p>Estimado/a {nombreRol},</p>
        <p>El aprendiz <strong>{nombreAprendiz}</strong> ha solicitado un permiso que requiere su aprobación.</p>
        <p>Por favor, ingrese al sistema para autorizar o rechazar la solicitud.</p>
        <br/>
        <p><em>Este es un mensaje automático del sistema Bienesoft.</em></p>
    ";
        }

        public async Task<ResponseSend> NotifyAprendizAsync(
    string emailDestino,
    string nombreAprendiz,
    string tipoAprendiz,
    List<string> aprobaciones,
    string acudiente,
    string acudienteTel
)
        {
            ResponseSend response = new ResponseSend();
            try
            {
                using (SmtpClient smtpClient = new SmtpClient(configServer.HostName, configServer.PortHost))
                {
                    smtpClient.Credentials = new NetworkCredential(configServer.Email, configServer.Password);
                    smtpClient.EnableSsl = true;

                    MailAddress remitente = new MailAddress(configServer.Email, "Bienesoft", Encoding.UTF8);
                    MailAddress destinatario = new MailAddress(emailDestino);

                    using (MailMessage message = new MailMessage(remitente, destinatario))
                    {
                        message.IsBodyHtml = true;
                        message.Subject = $"Tu permiso ha sido aprobado";

                        // Construir la lista de aprobaciones en HTML
                        string aprobacionesHtml = string.Join("", aprobaciones.Select(a => $"<li>{a}</li>"));

                        // Cuerpo del correo
                        message.Body = $@"
                    <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <p>Hola <strong>{nombreAprendiz}</strong>,</p>
                            <p>Nos complace informarte que tu permiso ha sido <strong>aprobado</strong> por todos los responsables asignados.</p>
                            
                            <p><strong>Tipo de aprendiz:</strong> {tipoAprendiz}</p>
                            <p><strong>Acudiente:</strong> {acudiente}</p>
                            <p><strong>Tel Acudiente:</strong> {acudienteTel}</p>

                            <p><strong>Responsables que aprobaron:</strong></p>
                            <ul>
                                {aprobacionesHtml}
                            </ul>

                            <p>Por favor, conserva este correo como constancia de tu permiso aprobado.</p>
                            <p>Tu acudiente <strong>{acudiente}</strong> ha sido notificado.</p>
                            <p>Atentamente,</p>
                            <p>Equipo de Bienesoft</p>
                        </body>
                    </html>";

                        message.BodyEncoding = Encoding.UTF8;

                        await smtpClient.SendMailAsync(message);
                    }
                }

                response.Status = true;
            }
            catch (Exception ex)
            {
                Addlog($"Error al notificar al aprendiz: {ex}");
                response.Message = ex.Message;
                response.Status = false;
            }

            return response;
        }



    }
}
