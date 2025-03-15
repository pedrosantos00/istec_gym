using Gym.DTOs.GymClasses.Request;
using Gym.DTOs.GymClasses.Response;
using Gym.Models.Gym;
using Riok.Mapperly.Abstractions;

namespace Gym.Mappers
{
    [Mapper]
    public static partial class GymClassMapper
    {
        // Map DTO to Gym
        public static partial GymClass MapToGym(CreateGymClassDTO model);

        [MapperIgnoreSource(nameof(UpdateGymClassDTO.Id))]
        public static partial void MapToGym(UpdateGymClassDTO source, GymClass target);

        // Map Gym to DTO
        public static partial GymClassDTO GymToDTO(GymClass model);
    }
}
