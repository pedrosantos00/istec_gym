using Gym.DTOs.Users.Request;
using Gym.DTOs.Users.Response;
using Gym.Models.Users;
using Riok.Mapperly.Abstractions;

namespace Gym.Mappers
{
    [Mapper]
    public static partial class UserMapper
    {
        // Map DTO to User
        public static partial ApplicationUser MapToUser(UserRegisterDTO model);
        public static partial ApplicationUser MapToUser(CreateUserDTO model);
        public static partial ApplicationUser MapToUser(UpdateUserDTO model);
        public static partial ApplicationUser MapToUser(UpdateUserRoleDto model);

        // Map USER to DTO
        public static partial UserDTO MapToDTO(ApplicationUser model);
    }
}