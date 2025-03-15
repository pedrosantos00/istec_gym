namespace Gym.Models.Common
{
    public class EntityBase
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime Updated { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
