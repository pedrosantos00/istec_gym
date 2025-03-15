using Gym.Data;
using Gym.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace Gym.Seeder
{
    public static class UserAdminSeeder
    {
        public static async Task Seed(UserManager<ApplicationUser> userManager)
        {
            const string adminEmail = "admin@mail.com";
            const string adminPassword = "!Admin123";
            const string adminRole = "Admin";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    FirstName = "Super",
                    LastName = "Admin",
                    Email = adminEmail,
                    NIF = "999999999",
                    PhoneNumber = "910000000",
                    BirthDate = DateTime.UtcNow,
                    Height = 0,
                    Role = Enums.Role.Admin,
                    Weight = 0,
                    Gender = Enums.Gender.Male,
                    UserName = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);

            }
        }
    }
}
