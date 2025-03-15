using System;
using System.Linq;
using Gym.Data;
using Gym.Enums;
using Gym.Models;
using Gym.Models.Gym;

namespace Gym.Seeder
{
    public static class GymClassesSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            if (context.GymClasses.Any())
            {
                return;
            }

            var classTemplates = new[]
            {
                new { Name = "Yoga", Duration = 60, Difficulty = Difficulty.Easy, MaxParticipants = 15 },
                new { Name = "HIIT", Duration = 45, Difficulty = Difficulty.Hard, MaxParticipants = 20 },
                new { Name = "Pilates", Duration = 50, Difficulty = Difficulty.Medium, MaxParticipants = 12 },
                new { Name = "Strength Training", Duration = 70, Difficulty = Difficulty.Hard, MaxParticipants = 25 },
                new { Name = "Zumba", Duration = 55, Difficulty = Difficulty.Medium, MaxParticipants = 18 },
                new { Name = "CrossFit", Duration = 60, Difficulty = Difficulty.Hard, MaxParticipants = 20 }
            };

            var gymClasses = Enum.GetValues(typeof(DayOfWeek))
                .Cast<DayOfWeek>()
                .Where(d => d != DayOfWeek.Saturday && d != DayOfWeek.Sunday) 
                .SelectMany(day => GenerateDailyClasses(day, classTemplates))
                .ToList();

            context.GymClasses.AddRange(gymClasses);
            context.SaveChanges();
        }

        private static IEnumerable<GymClass> GenerateDailyClasses(DayOfWeek day, dynamic[] classTemplates)
        {
            var today = DateTime.Today;
            var classDay = GetNextWeekday(today, day);

            return new[]
            {
                new GymClass
                {
                    Name = classTemplates[0].Name,
                    Day = classDay.AddHours(8),
                    Duration = classTemplates[0].Duration,
                    Difficulty = classTemplates[0].Difficulty,
                    MaxParticipants = classTemplates[0].MaxParticipants,
                    Status = GymClassStatus.Available
                },
                new GymClass
                {
                    Name = classTemplates[1].Name,
                    Day = classDay.AddHours(12),
                    Duration = classTemplates[1].Duration,
                    Difficulty = classTemplates[1].Difficulty,
                    MaxParticipants = classTemplates[1].MaxParticipants,
                    Status = GymClassStatus.Available
                },
                new GymClass
                {
                    Name = classTemplates[2].Name,
                    Day = classDay.AddHours(18),
                    Duration = classTemplates[2].Duration,
                    Difficulty = classTemplates[2].Difficulty,
                    MaxParticipants = classTemplates[2].MaxParticipants,
                    Status = GymClassStatus.Available
                }
            };
        }

        private static DateTime GetNextWeekday(DateTime start, DayOfWeek day)
        {
            int daysToAdd = ((int)day - (int)start.DayOfWeek + 7) % 7;
            return start.AddDays(daysToAdd).Date;
        }
    }
}
