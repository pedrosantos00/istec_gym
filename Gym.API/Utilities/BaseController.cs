using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Gym.API.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected Guid UserId
        {
            get
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                return string.IsNullOrEmpty(userIdClaim) ? Guid.Empty : Guid.Parse(userIdClaim);
            }
        }

        protected string DocumentNumber => User.FindFirst(JwtRegisteredClaimNames.UniqueName)?.Value ?? string.Empty;

        protected string UserRole => User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;

        protected bool IsInRole(string role) => User.IsInRole(role);

        protected string GetClaim(string claimType)
        {
            return User.FindFirst(claimType)?.Value ?? string.Empty;
        }
    }
}
