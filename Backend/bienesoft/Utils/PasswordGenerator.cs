using System;
using System.Text;

namespace Bienesoft.utils
{
    public static class PasswordGenerator
    {
        private static readonly string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        public static string Generate(int length = 8)
        {
            var random = new Random();
            var sb = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                var c = chars[random.Next(chars.Length)];
                sb.Append(c);
            }

            return sb.ToString();
        }
    }



}
