using Gym.Enums;

namespace Gym.DTOs.GymClasses.Request
{
    public class CreateGymClassDTO
    {
        public string Name { get; set; }
        public DateTime Day { get; set; }
        public int Duration { get; set; }
        public Difficulty Difficulty { get; set; }
        public int MaxParticipants { get; set; }
        public GymClassStatus Status { get; set; } = GymClassStatus.Available;
    }
}
