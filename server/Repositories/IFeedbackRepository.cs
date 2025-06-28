namespace server.Repositories
{
    public interface IFeedbackRepository
    {
        Task<Feedback> AddFeedbackAsync(Feedback feedback);
        Task<Feedback?> GetFeedbackByIdAsync(int id);
        Task<IEnumerable<Feedback>> GetAllFeedbacksAsync();
        Task UpdateFeedbackAsync(Feedback feedback);
        Task DeleteFeedbackAsync(Feedback feedback);

        Task<FeedbackMessage> AddFeedbackMessageAsync(FeedbackMessage message);
        Task<FeedbackMessage?> GetFeedbackMessageByIdAsync(int id);
        Task UpdateFeedbackMessageAsync(FeedbackMessage message);
        Task DeleteFeedbackMessageAsync(FeedbackMessage message);
    }
}
