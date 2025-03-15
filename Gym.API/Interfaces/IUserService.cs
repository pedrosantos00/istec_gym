using Gym.API.Utilities;
using Gym.DTOs.Users.Request;
using Gym.DTOs.Users.Response;
using Gym.Models.Common;

namespace Gym.Interfaces
{
    public interface IUserService
    {
        Task<Result<Paginator<UserDTO>>> GetAllUsers(int pageNumber, int pageSize);
        Task<Result<UserDTO>> GetUserById(Guid id);
        Task<Result<UserDTO>> CreateUser(CreateUserDTO request);
        Task<Result<UserDTO>> UpdateUser(Guid id, UpdateUserDTO request);
        Task<Result<string>> Login(UserLoginDTO request);
        Task<Result<UserDTO>> Register(UserRegisterDTO request);
        Task<Result<bool>> ForgotPassword(UserRecoverPasswordDTO request);
        Task<Result<bool>> ConfirmAccount(string token, string email);
        Task<Result<bool>> SendAccountConfirmationAsync(string model);
        Task<Result<bool>> DeleteUser(Guid id);
        Task<Result<UserDTO>> UpdateUserRole(Guid id, UpdateUserRoleDto request);
    }
}