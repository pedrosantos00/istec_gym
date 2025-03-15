using Gym.API.Utilities;
using Gym.DTOs.GymClasses.Request;
using Gym.DTOs.GymClasses.Response;
using Gym.Enums;
using Gym.Models.Common;

namespace Gym.Interfaces
{
    public interface IGymClassService
    {
        Task<Result<GymClassDTO>> Create(CreateGymClassDTO model);
        Task<Result<GymClassDTO>> GetById(Guid id);
        Task<Result<Paginator<GymClassDTO>>> GetAll(int pageNumber, int pageSize);
        Task<Result<List<GymClassDTO>>> GetCurrentUser(Guid user);
        Task<Result<List<GymClassAvailableDTO>>> GetAvailable(Guid user);
        Task<Result<GymClassDTO>> Update(Guid id, UpdateGymClassDTO model);
        Task<Result<GymClassDTO>> UpdateStatus(Guid id, GymClassStatus status);
        Task<Result<bool>> AddUser(UserManagementDTO request);
        Task<Result<bool>> RemoveUser(UserManagementDTO request);
        Task<Result<bool>> Delete(Guid id);
    }
}
