using System.Net;
using System.Text.Json;

namespace Gym.API.Utilities;

public record Result<T>(HttpStatusCode Code, T? Data, string? Message, object? Errors)
{
    public static Result<T> BadRequest(HttpStatusCode code, string message, object? errors)
    {
        var options = new JsonSerializerOptions
        {
            WriteIndented = false,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };
        return new Result<T>(code, default, message, errors ?? JsonSerializer.Serialize(errors, options));
    }

    public static Result<T> Error(HttpStatusCode code, string message) => new(code, default, message, null);

    public static Result<T> NotFound(string? message = "Not Found") => new(HttpStatusCode.NotFound, default, message, null);

    public static Result<T> Success(T? data = default, string? message = "Success") => new(HttpStatusCode.OK, data, message, default);

    public static Result<T> Created(T? data = default, string? message = "Created") => new(HttpStatusCode.Created, data, message, null);
}