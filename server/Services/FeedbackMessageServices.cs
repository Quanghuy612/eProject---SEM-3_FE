using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.Database;
using server.Models;
using server.DTOs.FeedbackMessageDTO;

namespace server.Services
{
    public class FeedbackMessageServices
    {
        private readonly DatabaseContext _context;

        public FeedbackMessageServices(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<FeedbackMessageResponse> CreateAsync(CreateFeedbackMessage dto, int senderId, bool isAgent)
        {
            var feedbackMessage = new FeedbackMessage
            {
                FeedbackId = dto.FeedbackId,
                SenderId = senderId,
                IsAgent = isAgent,
                Message = dto.Message,
                SentAt = DateTime.UtcNow
            };

            _context.FeedbackMessages.Add(feedbackMessage);
            await _context.SaveChangesAsync();

            return new FeedbackMessageResponse
            {
                MessageId = feedbackMessage.MessageId,
                FeedbackId = feedbackMessage.FeedbackId,
                SenderId = feedbackMessage.SenderId,
                IsAgent = feedbackMessage.IsAgent,
                Message = feedbackMessage.Message,
                SentAt = feedbackMessage.SentAt
            };
        }

        public async Task<FeedbackMessageResponse?> GetByIdAsync(int messageId)
        {
            var feedbackMessage = await _context.FeedbackMessages.FindAsync(messageId);
            if (feedbackMessage == null) return null;

            return new FeedbackMessageResponse
            {
                MessageId = feedbackMessage.MessageId,
                FeedbackId = feedbackMessage.FeedbackId,
                SenderId = feedbackMessage.SenderId,
                IsAgent = feedbackMessage.IsAgent,
                Message = feedbackMessage.Message,
                SentAt = feedbackMessage.SentAt
            };
        }

        public async Task<IEnumerable<FeedbackMessageResponse>> GetByFeedbackIdAsync(int feedbackId)
        {
            return await _context.FeedbackMessages
                .Where(fm => fm.FeedbackId == feedbackId)
                .OrderBy(fm => fm.SentAt)
                .Select(fm => new FeedbackMessageResponse
                {
                    MessageId = fm.MessageId,
                    FeedbackId = fm.FeedbackId,
                    SenderId = fm.SenderId,
                    IsAgent = fm.IsAgent,
                    Message = fm.Message,
                    SentAt = fm.SentAt
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateAsync(int messageId, string newMessage)
        {
            var feedbackMessage = await _context.FeedbackMessages.FindAsync(messageId);
            if (feedbackMessage == null) return false;

            feedbackMessage.Message = newMessage;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int messageId)
        {
            var feedbackMessage = await _context.FeedbackMessages.FindAsync(messageId);
            if (feedbackMessage == null) return false;

            _context.FeedbackMessages.Remove(feedbackMessage);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
