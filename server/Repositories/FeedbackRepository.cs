namespace server.Repositories
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly DatabaseContext _context;
        public FeedbackRepository(DatabaseContext context) {
            _context = context;
        }
        public async Task<Feedback> AddFeedbackAsync(Feedback feedback)
        {
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();
            return feedback;
        }
        public async Task<Feedback?> GetFeedbackByIdAsync(int id)
        {
                       return await _context.Feedbacks
                                 .Include(f => f.Messages)
                                 .FirstOrDefaultAsync(f => f.FeedbackId == id);
        }

        public async Task<IEnumerable<Feedback>> GetAllFeedbacksAsync()
        {
            return await _context.Feedbacks.ToListAsync();
        }

        public async Task UpdateFeedbackAsync(Feedback feedback)
        {
            _context.Entry(feedback).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFeedbackAsync(Feedback feedback)
        {
            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();
        }

        public async Task<FeedbackMessage> AddFeedbackMessageAsync(FeedbackMessage message)
        {
            _context.FeedbackMessages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<FeedbackMessage?> GetFeedbackMessageByIdAsync(int id)
        {
            return await _context.FeedbackMessages.FindAsync(id);
        }

        public async Task UpdateFeedbackMessageAsync(FeedbackMessage message)
        {
            _context.Entry(message).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFeedbackMessageAsync(FeedbackMessage message)
        {
            _context.FeedbackMessages.Remove(message);
            await _context.SaveChangesAsync();
        }
    }
}
