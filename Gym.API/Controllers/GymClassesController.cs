using Gym.API.Controllers;
using Gym.DTOs.GymClasses.Request;
using Gym.Enums;
using Gym.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gym.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class GymClassesController : BaseController
    {
        private readonly IGymClassService _gymClassService;

        public GymClassesController(IGymClassService gymClassService)
        {
            _gymClassService = gymClassService;
        }

        [HttpGet("{id}")]
        [Authorize(Policy = nameof(Role.Member))]
        public async Task<IActionResult> GetGymById(Guid id)
        {
            var result = await _gymClassService.GetById(id);
            return StatusCode((int)result.Code, result);
        }

        [HttpGet()]
        [Authorize(Policy = nameof(Role.Member))]
        public async Task<IActionResult> GetAll(int pageNumber, int pageSize)
        {
            var result = await _gymClassService.GetAll(pageNumber, pageSize);

            return StatusCode((int)result.Code, result);
        }

        [HttpGet("available")]
        [Authorize(Policy = nameof(Role.Member))]
        public async Task<IActionResult> GetAvailable()
        {
            var result = await _gymClassService.GetAvailable(UserId);

            return StatusCode((int)result.Code, result);
        }

        [HttpGet("current")]
        [Authorize(Policy = nameof(Role.Member))]
        public async Task<IActionResult> GetCurrent()
        {
            var result = await _gymClassService.GetCurrentUser(UserId);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost()]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> CreateGym(CreateGymClassDTO model)
        {
            var result = await _gymClassService.Create(model);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("{id}/status")]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> ChangeGymClassStatus(Guid id, GymClassStatus model)
        {
            var result = await _gymClassService.UpdateStatus(id, model);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("add-user")]
        [Authorize(Policy = nameof(Role.Member))]
        public async Task<IActionResult> AddUserToGymClass(UserManagementDTO model)
        {
            var result = await _gymClassService.AddUser(model);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("remove-user")]
        [Authorize(Policy = nameof(Role.Member))]
        public async Task<IActionResult> RemoveUserToGymClass(UserManagementDTO model)
        {
            var result = await _gymClassService.RemoveUser(model);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("{id}/update")]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> UpdateGym(Guid id, UpdateGymClassDTO model)
        {
            var result = await _gymClassService.Update(id, model);

            return StatusCode((int)result.Code, result);
        }

        [HttpDelete("{id}/delete")]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> DeleteGym(Guid id)
        {
            var response = await _gymClassService.Delete(id);

            return StatusCode((int)response.Code, response);
        }
    }
}
