using Gym.Enums;

namespace Gym.DTOs.GymClasses.Request
{
    public class UpdateGymClassDTO
    {
        public Guid? Id { get; set; }
        public string? Name { get; set; }
        public DateTime? Day { get; set; }
        public int? Duration { get; set; }
        public Difficulty? Difficulty { get; set; }
        public int? MaxParticipants { get; set; }
        public GymClassStatus? Status { get; set; } = GymClassStatus.Available;
    }
}
