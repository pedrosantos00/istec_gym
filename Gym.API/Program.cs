using Gym.API.Helpers;
using Gym.API.Utilities;
using Gym.Data;
using Gym.Models.Common;
using Gym.Models.Users;
using Gym.Seeder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Gym;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configure DbContext
        builder.Services.AddDbContext<ApplicationDbContext>(opt =>
            opt.UseSqlite("Data Source=gym.db"));

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("Cors",
                builder =>
                {
                    builder.AllowAnyOrigin();
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
        });

        builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(nameof(JwtSettings)));
        builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection(nameof(SmtpSettings)));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>()
              .AddEntityFrameworkStores<ApplicationDbContext>()
              .AddDefaultTokenProviders();

        // Configure Services and Authentication
        builder.Services.ConfigureAuthentication(builder.Configuration);
        builder.Services.ConfigureSwagger();
        builder.Services.ConfigureServices();


        builder.Services.AddControllers();

        builder.Services.Configure<PasswordHasherOptions>(options =>
        {
            options.CompatibilityMode = PasswordHasherCompatibilityMode.IdentityV3;
        });

        var app = builder.Build();

        // Apply migrations at startup
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Database.Migrate();
        }

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            context.Database.EnsureCreated();

            GymClassesSeeder.Seed(context);

            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

            await UserAdminSeeder.Seed(userManager);
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseMiddleware<CustomExceptionHandlerMiddleware>();

        app.UseCors("Cors");

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseHttpsRedirection();

        app.MapControllers();

        app.Run();
    }
}