using server.DTOs.FeedbackDTO;
using server.DTOs.FeedbackMessageDTO;
using System.Security.Claims;

namespace server.Services
{
    public class FeedbackService
    {
        private readonly IFeedbackRepository _feedbackRepository;

        public FeedbackService(IFeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }

        public async Task<ApiResponse> CreateFeedbackAsync(CreateFeedback createFeedbackDto)
        {
            var feedback = new Feedback
            {
                Subject = createFeedbackDto.Subject,
                InitialMessage = createFeedbackDto.InitialMessage,
                Ratting = createFeedbackDto.Ratting,
                CreatedAt = DateTime.UtcNow,
                UserId = createFeedbackDto.UserId,
                Status = "Open"
            };

            var createdFeedback = await _feedbackRepository.AddFeedbackAsync(feedback);

            return ApiResponse.Success(null, "Feedback created successfully.");
        }

        public async Task<ApiResponse> GetFeedbacks(int currentPage)
        {
            const int pageSize = 10;

            var allFeedbacks = await _feedbackRepository.GetAllFeedbacksAsync();

            var approvedFeedbacks = allFeedbacks
                .Where(f => f.Status == "Approved")
                .ToList();

            int totalItems = approvedFeedbacks.Count;

            var pagedFeedbacks = approvedFeedbacks
                .Skip((currentPage - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return ApiResponse.Success(new
            {
                data = pagedFeedbacks,
                totalItems
            }, "Get feedbacks successfully");
        }

        public async Task<ApiResponse> GetFeedbackByIdAsync(int id)
        {
            var feedback = await _feedbackRepository.GetFeedbackByIdAsync(id);
            if (feedback == null)
            {
                return ApiResponse.Error(404, $"Feedback with ID {id} not found.");
            }

            var feedbackResponse = new FeedbackResponse
            {
                FeedbackId = feedback.FeedbackId,
                UserId = feedback.UserId,
                Subject = feedback.Subject,
                InitialMessage = feedback.InitialMessage,
                Status = feedback.Status,
                Ratting = feedback.Ratting,
                CreatedAt = feedback.CreatedAt,
                Messages = feedback.Messages
                .Select(m => new FeedbackMessageResponse
                {
                    MessageId = m.MessageId,
                    FeedbackId = m.FeedbackId,
                    SenderId = m.SenderId,
                    IsAgent = m.IsAgent,
                    Message = m.Message,
                    SentAt = m.SentAt
                })
                .OrderBy(m => m.SentAt)
                .ToList()
            };

            return ApiResponse.Success(feedbackResponse);
        }

        public async Task<ApiResponse> UpdateFeedbackAsync(int id,UpdateFeedback updateFeedbackDto, ClaimsPrincipal userClaims)
        {
            var feedback = await _feedbackRepository.GetFeedbackByIdAsync(id);
            if (feedback == null)
            {
                return ApiResponse.Error(404, $"Feedback with ID {id} not found.");
            }

            //var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier);
            //if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int authenticatedUserId))
            //{
            //    return ApiResponse.Error(401, "User is not authenticated.");
            //}
            //if (feedback.UserId != authenticatedUserId && !(userClaims.IsInRole("Admin") || userClaims.IsInRole("Agent")))
            //{
            //    return ApiResponse.Error(403, "You do not have permission to update this feedback.");
            //}

            if (updateFeedbackDto.Subject != null)
            {
                feedback.Subject = updateFeedbackDto.Subject;
            }
            if (updateFeedbackDto.InitialMessage != null)
            {
                feedback.InitialMessage = updateFeedbackDto.InitialMessage;
            }
            if (updateFeedbackDto.Status != null)
            {
                if (!new string[] { "Open", "InProgress", "Closed" }.Contains(updateFeedbackDto.Status))
                {
                    return ApiResponse.Error(400, "Invalid status value. Valid values are Open, InProgress, Closed.");
                }
                feedback.Status = updateFeedbackDto.Status;
            }
            if (updateFeedbackDto.Ratting.HasValue)
            {
                feedback.Ratting = updateFeedbackDto.Ratting.Value;
            }

            await _feedbackRepository.UpdateFeedbackAsync(feedback);
            return ApiResponse.Success(null, "Feedback updated successfully.");
        }

        public async Task<ApiResponse> DeleteFeedbackAsync(int id, ClaimsPrincipal userClaims)
        {
            var feedback = await _feedbackRepository.GetFeedbackByIdAsync(id);
            if (feedback == null)
            {
                return ApiResponse.Error(404, $"Feedback with ID {id} not found.");
            }

            if (!(userClaims.IsInRole("Admin")))
            {
                return ApiResponse.Error(403, "You do not have permission to delete this feedback.");
            }

            await _feedbackRepository.DeleteFeedbackAsync(feedback);
            return ApiResponse.Success(null, "Feedback deleted successfully.");
        }

        //public async Task<ApiResponse> AddMessageToFeedbackAsync(CreateFeedbackMessage createMessageDto, ClaimsPrincipal userClaims)
        //{
        //    var senderIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier);
        //    if (senderIdClaim == null || !int.TryParse(senderIdClaim.Value, out int authenticatedSenderId)) 
        //    {
        //        return ApiResponse.Error(401, "User is not authenticated or SenderId not found.");
        //    }

        //    var feedback = await _feedbackRepository.GetFeedbackByIdAsync(createMessageDto.FeedbackId);
        //    if (feedback == null)
        //    {
        //        return ApiResponse.Error(404, $"Feedback with ID {createMessageDto.FeedbackId} not found.");
        //    }

        //    var message = new FeedbackMessage
        //    {
        //        FeedbackId = createMessageDto.FeedbackId,
        //        SenderId = authenticatedSenderId,
        //        IsAgent = userClaims.IsInRole("Agent") || userClaims.IsInRole("Admin"),
        //        Message = createMessageDto.Message,
        //        SentAt = DateTime.UtcNow
        //    };

        //    var createdMessage = await _feedbackRepository.AddFeedbackMessageAsync(message);

        //    var messageResponse = new FeedbackMessageResponse
        //    {
        //        MessageId = createdMessage.MessageId,
        //        FeedbackId = createdMessage.FeedbackId,
        //        SenderId = createdMessage.SenderId,
        //        IsAgent = createdMessage.IsAgent,
        //        Message = createdMessage.Message,
        //        SentAt = createdMessage.SentAt
        //    };

        //    return ApiResponse.Success(messageResponse, "Message added successfully.");
        //}

        //public async Task<ApiResponse> UpdateFeedbackMessageAsync(int id, UpdateFeedbackMessage updateMessageDto, ClaimsPrincipal userClaims)
        //{
        //    var message = await _feedbackRepository.GetFeedbackMessageByIdAsync(id);
        //    if (message == null)
        //    {
        //        return ApiResponse.Error(404, $"Feedback message with ID {id} not found.");
        //    }

        //    var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier);
        //    if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int authenticatedUserId))
        //    {
        //        return ApiResponse.Error(401, "User is not authenticated.");
        //    }
        //    if (message.SenderId != authenticatedUserId && !(userClaims.IsInRole("Admin") || userClaims.IsInRole("Agent")))
        //    {
        //        return ApiResponse.Error(403, "You do not have permission to update this message.");
        //    }

        //    message.Message = updateMessageDto.Message;
        //    await _feedbackRepository.UpdateFeedbackMessageAsync(message);

        //    return ApiResponse.Success(null, "Feedback message updated successfully.");
        //}

        //public async Task<ApiResponse> DeleteFeedbackMessageAsync(int id, ClaimsPrincipal userClaims)
        //{
        //    var message = await _feedbackRepository.GetFeedbackMessageByIdAsync(id);
        //    if (message == null)
        //    {
        //        return ApiResponse.Error(404, $"Feedback message with ID {id} not found.");
        //    }
        //    var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier);
        //    if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int authenticatedUserId))
        //    {
        //        return ApiResponse.Error(401, "User is not authenticated.");
        //    }
        //    if (message.SenderId != authenticatedUserId && !(userClaims.IsInRole("Admin") || userClaims.IsInRole("Agent")))
        //    {
        //        return ApiResponse.Error(403, "You do not have permission to delete this message.");
        //    }

        //    await _feedbackRepository.DeleteFeedbackMessageAsync(message);
        //    return ApiResponse.Success(null, "Feedback message deleted successfully.");
        //}
    }
}