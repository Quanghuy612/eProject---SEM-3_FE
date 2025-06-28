using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DTOs.ApiResponseDTO;
using server.DTOs.FeedbackDTO;
using server.DTOs.FeedbackMessageDTO;
using server.Services; 

namespace server.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class FeedbackController : BaseApiController
    {
        private readonly FeedbackService _feedbackService;

        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFeedbacks([FromQuery] int? currentPage)
        {
            var result = await _feedbackService.GetFeedbacks(currentPage ?? 1);
            return ToActionResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedback createFeedbackDto)
        {
            var result = await _feedbackService.CreateFeedbackAsync(createFeedbackDto);
            return ToActionResult(result); 
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeedbackById(int id)
        {
            var result = await _feedbackService.GetFeedbackByIdAsync(id);
            return ToActionResult(result);
        }
    }
}