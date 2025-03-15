using Gym.Enums;
using Gym.Models.Gym;
using Microsoft.AspNetCore.Identity;

namespace Gym.Models.Users
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NIF { get; set; }

        public Gender Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }
        public Role Role { get; set; } = Role.Member;
        public bool IsDeleted { get; set; } = false;

        public ICollection<GymClass> GymClasses { get; set; } = new HashSet<GymClass>();
    }
}
