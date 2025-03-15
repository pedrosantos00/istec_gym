using System.Net;
using System.Text.Json;

namespace Gym.API.Utilities
{
    public class CustomExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = HttpStatusCode.InternalServerError;
            Result<object>? response = null;

            switch (exception)
            {
                case KeyNotFoundException:
                    statusCode = HttpStatusCode.NotFound;
                    response = Result<object>.NotFound("Resource not found");
                    break;

                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Unauthorized;
                    response = Result<object>.Error(statusCode, "Unauthorized access");
                    break;

                case ArgumentException argEx:
                    statusCode = HttpStatusCode.BadRequest;
                    response = Result<object>.BadRequest(statusCode, argEx.Message, new { Details = argEx.Message });
                    break;

                default:
                    response = Result<object>.Error(statusCode, "An unexpected error occurred");
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var options = new JsonSerializerOptions
            {
                WriteIndented = false,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
        }
    }
}
