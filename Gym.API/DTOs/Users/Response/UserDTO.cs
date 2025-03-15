using Gym.Enums;

namespace Gym.DTOs.Users.Response
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string NIF { get; set; }

        public Gender Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }
        
        public Role Role { get; set; }
    }
}
