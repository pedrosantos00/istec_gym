using Gym.Enums;
using Gym.Models.Common;
using Gym.Models.Users;

namespace Gym.Models.Gym
{
    public class GymClass : EntityBase
    {
        public string Name { get; set; }
        public DateTime Day { get; set; }
        public int Duration { get; set; }
        public Difficulty Difficulty { get; set; }
        public int MaxParticipants { get; set; }
        public GymClassStatus Status { get; set; } = GymClassStatus.Available;

        public ICollection<ApplicationUser> Users { get; set; } = new HashSet<ApplicationUser>();
    }
}
