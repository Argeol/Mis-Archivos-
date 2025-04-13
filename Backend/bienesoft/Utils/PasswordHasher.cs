using System;
using System.Security.Cryptography;
using System.Text;

namespace Bienesoft.utils
{

    public static class PasswordHasher
    {
        public static string GenerateSalt(int size = 16)
        {
            var rng = new RNGCryptoServiceProvider();
            var buffer = new byte[size];
            rng.GetBytes(buffer);
            return Convert.ToBase64String(buffer);
        }

        public static string HashPassword(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var saltedPassword = password + salt;
                byte[] bytes = Encoding.UTF8.GetBytes(saltedPassword);
                byte[] hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        public static bool VerifyPassword(string inputPassword, string storedHash, string salt)
        {
            var hashOfInput = HashPassword(inputPassword, salt);
            return hashOfInput == storedHash;
        }
    }


}
