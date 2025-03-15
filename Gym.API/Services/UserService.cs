using Gym.API.Utilities;
using Gym.API.Utilities.Authorization;
using Gym.Data;
using Gym.DTOs.GymClasses.Response;
using Gym.DTOs.Users.Request;
using Gym.DTOs.Users.Response;
using Gym.Interfaces;
using Gym.Mappers;
using Gym.Models.Common;
using Gym.Models.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Web.Helpers;

namespace Gym.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IConfiguration _configuration;

        public UserService(ApplicationDbContext context, IEmailService emailService,
            UserManager<ApplicationUser> userManager, IJwtTokenGenerator jwtTokenGenerator,
            IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _userManager = userManager;
            _jwtTokenGenerator = jwtTokenGenerator;
            _configuration = configuration;
        }

        #region Login Operations

        public async Task<Result<string>> Login(UserLoginDTO request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user is null)
            {
                return Result<string>.BadRequest(HttpStatusCode.BadRequest, "Login Failed", "Invalid Credentials");
            }

            if (!user.EmailConfirmed)
            {
                return Result<string>.BadRequest(HttpStatusCode.BadRequest, "Login Failed",
                    "Account verification is required to proceed. Please check your email inbox.");
            }

            var login = await _userManager.CheckPasswordAsync(user, request.Password);

            if (!login)
            {
                return Result<string>.BadRequest(HttpStatusCode.BadRequest, "Login Failed", "Invalid Credentials");
            }

            var token = _jwtTokenGenerator.GenerateToken(user);

            return Result<string>.Success(token, "Login Successfully");
        }

        public async Task<Result<UserDTO>> Register(UserRegisterDTO request)
        {
            var existingUserByNIF = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.NIF.ToLower() == request.NIF.ToLower() || u.Email.ToLower() == request.Email.ToLower());
            if (existingUserByNIF != null)
            {
                return Result<UserDTO>.BadRequest(HttpStatusCode.BadRequest, "User Registration Failed",
                    "User already exists.");
            }

            var user = UserMapper.MapToUser(request);
            user.UserName = user.Email;

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return Result<UserDTO>.BadRequest(HttpStatusCode.BadRequest, "Error while creating User.",
                    result.Errors.Select(e => e.Description));
            }

            await SendAccountConfirmationAsync(user.Email);

            return Result<UserDTO>.Success(UserMapper.MapToDTO(user), "User registered successfully.");
        }

        public async Task<Result<bool>> ForgotPassword(UserRecoverPasswordDTO request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);


            if (user is null || !IsUserCredentialsValid(request, user))
            {
                return Result<bool>.BadRequest(HttpStatusCode.BadRequest, "User Recover Password Failed",
                    "Failed to recover Account");
            }

            string randomPassword = GeneratePassword();
            string token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, randomPassword);

            if (result.Succeeded)
            {
                _emailService.SendPasswordResetEmail(request.Email, randomPassword);
            }

            return Result<bool>.Success(true, "Email sent to recover password");
        }

        public async Task<Result<bool>> ConfirmAccount(string token, string email)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user is not null)
            {
                var confirmation = await _userManager.ConfirmEmailAsync(user, token);

                if (confirmation.Succeeded)
                {
                    return Result<bool>.Success(true, message: "Email Confirmed");
                }
            }

            return Result<bool>.BadRequest(HttpStatusCode.BadRequest, "Confirm User Account Failed",
                "Unable to confirm the account, please try again later.");
        }

        #endregion

        #region Create

        public async Task<Result<UserDTO>> CreateUser(CreateUserDTO request)
        {
            var existingUserByNIF = await _userManager.Users.FirstOrDefaultAsync(u =>
                u.NIF.ToLower() == request.NIF.ToLower() || u.Email.ToLower() == request.Email.ToLower());
            if (existingUserByNIF != null)
            {
                return Result<UserDTO>.BadRequest(HttpStatusCode.BadRequest, "User Registration Failed",
                    "User already exists.");
            }

            var user = UserMapper.MapToUser(request);
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return Result<UserDTO>.BadRequest(HttpStatusCode.BadRequest, "Error while creating User.",
                    result.Errors.Select(e => e.Description));
            }

            await SendAccountConfirmationAsync(user.Email);

            return Result<UserDTO>.Success(UserMapper.MapToDTO(user), "User registered successfully.");
        }

        #endregion

        #region Get

        public async Task<Result<Paginator<GymClassDTO>>> GetAll(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.GymClasses.CountAsync();

            // Fetch paginated data
            var gymClasses = await _context.GymClasses
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(g => GymClassMapper.GymToDTO(g))
                .ToListAsync();

            if (!gymClasses.Any())
            {
                return Result<Paginator<GymClassDTO>>.NotFound();
            }

            var paginator = new Paginator<GymClassDTO>(gymClasses, totalRecords, pageNumber, pageSize);

            return Result<Paginator<GymClassDTO>>.Success(paginator);
        }

        public async Task<Result<Paginator<UserDTO>>> GetAllUsers(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.Users.CountAsync();

            var users = await _context.Users
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Where(u => !u.IsDeleted)
                .Select(g => UserMapper.MapToDTO(g))
                .ToListAsync();

            if (!users.Any())
            {
                return Result<Paginator<UserDTO>>.NotFound();
            }

            var paginator = new Paginator<UserDTO>(users, totalRecords, pageNumber, pageSize);

            return Result<Paginator<UserDTO>>.Success(paginator);
        }

        public async Task<Result<UserDTO>> GetUserById(Guid id)
        {
            var existingUser = await _userManager.Users
                .Where(u => !u.IsDeleted)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser is null)
            {
                return Result<UserDTO>.NotFound();
            }

            return Result<UserDTO>.Success(UserMapper.MapToDTO(existingUser));
        }

        #endregion

        #region Update

        public async Task<Result<UserDTO>> UpdateUser(Guid id, UpdateUserDTO request)
        {
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser is null)
            {
                return Result<UserDTO>.NotFound();
            }

            existingUser = UserMapper.MapToUser(request);

            _context.Update(existingUser);

            await _context.SaveChangesAsync();

            return Result<UserDTO>.Success(UserMapper.MapToDTO(existingUser), "User updated successfully.");
        }

        #endregion

        #region Delete

        public async Task<Result<bool>> DeleteUser(Guid id)
        {
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser is null)
            {
                return Result<bool>.NotFound();
            }

            existingUser.IsDeleted = true;
            _context.Update(existingUser);

            await _context.SaveChangesAsync();

            return Result<bool>.Success(true, "User Delete successfully.");
        }

        public async Task<Result<UserDTO>> UpdateUserRole(Guid id, UpdateUserRoleDto request)
        {
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (existingUser is null)
            {
                return Result<UserDTO>.NotFound();
            }

            existingUser.Role = request.Role;

            _context.Update(existingUser);

            if (await _context.SaveChangesAsync() < 1)
            {
                return Result<UserDTO>.Error(HttpStatusCode.BadRequest, "Error on user update.");
            }

            return Result<UserDTO>.Success(UserMapper.MapToDTO(existingUser), "User updated successfully.");
        }

        #endregion

        private string GeneratePassword(
            int requiredLength = 12,
            int requiredUniqueChars = 1,
            bool requireNonAlphanumeric = true,
            bool requireLowercase = true,
            bool requireUppercase = true,
            bool requireDigit = true)
        {
            const string lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
            const string uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string digitChars = "0123456789";
            const string nonAlphanumericChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

            var random = new Random();
            var passwordChars = "";

            if (requireLowercase)
                passwordChars += lowercaseChars[random.Next(lowercaseChars.Length)];
            if (requireUppercase)
                passwordChars += uppercaseChars[random.Next(uppercaseChars.Length)];
            if (requireDigit)
                passwordChars += digitChars[random.Next(digitChars.Length)];
            if (requireNonAlphanumeric)
                passwordChars += nonAlphanumericChars[random.Next(nonAlphanumericChars.Length)];

            var allChars = (lowercaseChars + uppercaseChars + digitChars + nonAlphanumericChars).ToCharArray();
            while (passwordChars.Length < requiredLength)
            {
                passwordChars += allChars[random.Next(allChars.Length)];
            }

            passwordChars = new string(passwordChars.OrderBy(_ => random.Next()).ToArray());
            if (requiredUniqueChars > 1)
            {
                var uniqueCount = passwordChars.Distinct().Count();
                while (uniqueCount < requiredUniqueChars)
                {
                    passwordChars += allChars[random.Next(allChars.Length)];
                    uniqueCount = passwordChars.Distinct().Count();
                }
            }

            return new string(passwordChars.OrderBy(_ => random.Next()).ToArray());
        }

        private bool IsUserCredentialsValid(UserRecoverPasswordDTO model, ApplicationUser user)
        {
            return model.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase) &&
                   model.NIF.Equals(user.NIF, StringComparison.OrdinalIgnoreCase);
        }

        public async Task<Result<bool>> SendAccountConfirmationAsync(string email)
        {
            var user = _userManager.Users.FirstOrDefault(u => u.Email == email);

            if (user is not null)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationUrl = $"{_configuration["WebApp"]}/confirm?email={user.Email}&token={token}";

                _emailService.SendAccountConfirmationEmail(user.Email!, confirmationUrl);
            }

            return Result<bool>.Success();
        }

    }
}