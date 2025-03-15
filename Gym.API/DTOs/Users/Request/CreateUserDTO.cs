using Gym.Enums;

namespace Gym.DTOs.Users.Request
{
    public class CreateUserDTO
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NIF { get; set; }
        public string Password { get; set; }

        public Gender Gender { get; set; }
        public Role Role { get; set; }
        public DateTime BirthDate { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }
    }
}
