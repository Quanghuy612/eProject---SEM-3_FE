
using server.DTOs.ApiResponseDTO;

namespace server.Controllers
{
    public class BaseApiController : ControllerBase
    {
        protected IActionResult ToActionResult(ApiResponse response)
        {
            return response.StatusCode switch
            {
                200 => Ok(response),
                201 => Created(string.Empty, response),
                204 => NoContent(),
                400 => BadRequest(response),
                401 => Unauthorized(response),
                403 => Forbid(),
                404 => NotFound(response),
                500 => StatusCode(500, response),
                _ => StatusCode(response.StatusCode, response)
            };
        }

    }
}
