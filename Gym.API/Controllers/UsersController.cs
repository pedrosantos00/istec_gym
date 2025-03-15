using Gym.API.Controllers;
using Gym.Data;
using Gym.DTOs.Users.Request;
using Gym.Enums;
using Gym.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Gym.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public UsersController(ApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet("current")]
        [Authorize(Policy = nameof(Role.Member))]
        public async Task<IActionResult> GetUser()
        {
            var result = await _userService.GetUserById(UserId);
            return StatusCode((int)result.Code, result);
        }

        [HttpGet("{id}")]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var result = await _userService.GetUserById(id);
            return StatusCode((int)result.Code, result);
        }

        [HttpGet()]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> GetAllUsers(int pageNumber, int pageSize)
        {
            var result = await _userService.GetAllUsers(pageNumber, pageSize);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("create")]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> CreateUser(CreateUserDTO userRegistrationFormDTO)
        {
            var result = await _userService.CreateUser(userRegistrationFormDTO);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("{id}/update")]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDTO userUpdateDTO)
        {
            var result = await _userService.UpdateUser(id, userUpdateDTO);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO request)
        {
            var result = await _userService.Register(request);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO request)
        {
            var result = await _userService.Login(request);

            return StatusCode((int)result.Code, result);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] UserRecoverPasswordDTO request)
        {
            var response = await _userService.ForgotPassword(request);

            return StatusCode((int)response.Code, response);
        }

        [HttpGet("confirmation")]
        public async Task<IActionResult> ConfirmAccount([FromHeader] string email, [FromHeader] string token)
        {
            var response = await _userService.ConfirmAccount(token, email);

            return StatusCode((int)response.Code, response);
        }

        [HttpPost("confirmation")]
        public async Task<IActionResult> SendEmailConfirmation(ResendEmailConfirmationDTO request)
        {
            var response = await _userService.SendAccountConfirmationAsync(request.Email);

            return StatusCode((int)response.Code, response);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = nameof(Role.PT))]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var response = await _userService.DeleteUser(id);

            return StatusCode((int)response.Code, response);
        }

        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateRole(Guid id, UpdateUserRoleDto request)
        {
            var result = await _userService.UpdateUserRole(id, request);

            return StatusCode((int)result.Code, result);
        }
    }
}