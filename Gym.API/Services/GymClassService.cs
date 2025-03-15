using Gym.API.Utilities;
using Gym.Data;
using Gym.DTOs.GymClasses.Request;
using Gym.DTOs.GymClasses.Response;
using Gym.Enums;
using Gym.Interfaces;
using Gym.Mappers;
using Gym.Models.Common;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Gym.Services
{
    public class GymClassService : IGymClassService
    {
        private readonly ApplicationDbContext _context;
        public GymClassService(ApplicationDbContext context)
        {
            _context = context;
        }

        #region Create
        public async Task<Result<bool>> AddUser(UserManagementDTO request)
        {
            var gymClass = await _context.GymClasses
                .Include(g => g.Users)
                .Where(g => !g.IsDeleted)
                .FirstOrDefaultAsync(g => g.Id == request.GymClassId);

            if (gymClass == null)
            {
                return Result<bool>.NotFound("Gym class not found.");
            }

            if(gymClass.Users.Count + 1 > gymClass.MaxParticipants)
            {
                return Result<bool>.BadRequest(System.Net.HttpStatusCode.BadRequest, "Adding User Failed", "Gym class with Max Participants exceeded");
            }

            if (gymClass.Users.Any(u => u.Email.ToLower() == request.Email.ToLower()))
            {
                return Result<bool>.BadRequest(System.Net.HttpStatusCode.BadRequest, "Adding User Failed", "User is already in this gym class.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null)
            {
                return Result<bool>.NotFound("User not found.");
            }

            gymClass.Users.Add(user);

            await _context.SaveChangesAsync();

            return Result<bool>.Success(true);
        }

        public async Task<Result<GymClassDTO>> Create(CreateGymClassDTO model)
        {
            DateTime newClassStart = model.Day;
            DateTime newClassEnd = model.Day.AddMinutes(model.Duration);

            // Check if a conflicting class exists
            var conflictExists = await _context.GymClasses
                .Where(g => !g.IsDeleted)
                .AnyAsync(g =>
                    newClassStart < g.Day.AddMinutes(g.Duration) &&
                    newClassEnd > g.Day
                );

            if (conflictExists)
            {
                return Result<GymClassDTO>.BadRequest(System.Net.HttpStatusCode.BadRequest,
                    "Create Gym Class Failed",
                    "There is already a gym class scheduled during this time.");
            }

            var gymClass = GymClassMapper.MapToGym(model);
            _context.GymClasses.Add(gymClass);
            await _context.SaveChangesAsync();

            return Result<GymClassDTO>.Success(GymClassMapper.GymToDTO(gymClass));
        }

        #endregion

        #region Get
        public async Task<Result<GymClassDTO>> GetById(Guid id)
        {
            var gymClass = await _context.GymClasses
                .Where(g => !g.IsDeleted)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gymClass is null)
            {
                return Result<GymClassDTO>.NotFound();
            }

            return Result<GymClassDTO>.Success(GymClassMapper.GymToDTO(gymClass));
        }

        public async Task<Result<Paginator<GymClassDTO>>> GetAll(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.GymClasses
                .Where(g => !g.IsDeleted)
                .CountAsync();

            var gymClasses = await _context.GymClasses
                .Where(g => !g.IsDeleted)
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


        public async Task<Result<List<GymClassDTO>>> GetCurrentUser(Guid user)
        {
            var gymUserClasses = await _context.GymClasses
                 .Where(g => !g.IsDeleted)
                 .Where(g => g.Users.Any(u => u.Id == user))
                    .Select(g => GymClassMapper.GymToDTO(g))
                    .ToListAsync();

            if (gymUserClasses.Count <= 0)
            {
                return Result<List<GymClassDTO>>.NotFound();
            }


            return Result<List<GymClassDTO>>.Success(gymUserClasses);
        }

        public async Task<Result<List<GymClassAvailableDTO>>> GetAvailable(Guid user)
        {
            List<GymClassAvailableDTO> gymUserClasses = await _context.GymClasses
                  .Include(g => g.Users)
                  .Where(g => !g.IsDeleted)
                  .Where(g => g.Day > DateTime.UtcNow)
                  .Where(g => !g.Users.Any(u => u.Id == user))
                    .Select(g => new GymClassAvailableDTO
                    {
                        Id = g.Id,
                        Day = g.Day,
                        Name = g.Name,
                        Duration = g.Duration,
                        Difficulty = g.Difficulty,
                        MaxParticipants = g.MaxParticipants,
                        TotalParticipants = g.Users.Count,
                        Status = g.Status
                    })
                    .ToListAsync();

            if (gymUserClasses.Count <= 0)
            {
                return Result<List<GymClassAvailableDTO>>.NotFound();
            }


            return Result<List<GymClassAvailableDTO>>.Success(gymUserClasses);
        }

        #endregion

        #region Update

        public async Task<Result<GymClassDTO>> Update(Guid id, UpdateGymClassDTO model)
        {
            var gymClass = await _context.GymClasses
                .Where(g => !g.IsDeleted)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gymClass == null)
            {
                return Result<GymClassDTO>.NotFound("Gym class not found.");
            }

            GymClassMapper.MapToGym(model, gymClass);

            _context.GymClasses.Update(gymClass);
            await _context.SaveChangesAsync();

            return Result<GymClassDTO>.Success(GymClassMapper.GymToDTO(gymClass));
        }

        public async Task<Result<GymClassDTO>> UpdateStatus(Guid id, GymClassStatus status)
        {
            var gymClass = await _context.GymClasses
                .Where(g => !g.IsDeleted)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gymClass == null)
            {
                return Result<GymClassDTO>.NotFound("Gym class not found.");
            }

            gymClass.Status = status;

            _context.GymClasses.Update(gymClass);
            await _context.SaveChangesAsync();

            return Result<GymClassDTO>.Success(GymClassMapper.GymToDTO(gymClass));
        }

        #endregion

        #region Delete
        public async Task<Result<bool>> RemoveUser(UserManagementDTO request)
        {
            var gymClass = await _context.GymClasses
                .Where(g => !g.IsDeleted)
                .Include(g => g.Users)
                .FirstOrDefaultAsync(g => g.Id == request.GymClassId);

            if (gymClass == null)
            {
                return Result<bool>.NotFound("Gym class not found.");
            }

            if (!gymClass.Users.Any(u => u.Email.ToLower() == request.Email.ToLower()))
            {
                return Result<bool>.BadRequest(System.Net.HttpStatusCode.BadRequest,"Remove user from Gym Class Failed" , "User is not in this gym class.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null)
            {
                return Result<bool>.NotFound("User not found.");
            }

            gymClass.Users.Remove(user);

            await _context.SaveChangesAsync();

            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> Delete(Guid id)
        {
            var gymClass = await _context.GymClasses
                .Where(g => !g.IsDeleted)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gymClass == null)
            {
                return Result<bool>.NotFound("Gym class not found.");
            }

            gymClass.IsDeleted = true;

            _context.GymClasses.Update(gymClass);
            await _context.SaveChangesAsync();

            return Result<bool>.Success(true);
        }

        #endregion
    }
}
