import { useState, useEffect } from 'react';
import API from '../../api/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import FeedbackMessage from './FeedbackMessage';

interface DecodedToken {
    UserId: string;
}

interface FeedbackForm {
    userId: number;
    subject: string;
    initialMessage: string;
    status: string;
    ratting: number;
}

interface Feedback {
    feedbackId: number;
    userId: number;
    subject: string;
    initialMessage: string;
    status: string;
    ratting: number;
    createdAt: string;
    messages: any[];
}

interface ApiResponse<T> {
    statusCode: number;
    data: T;
    message: string | null;
}

function Feedback() {
    const { token } = useAuthStore();
    const decodedToken = token ? jwtDecode<DecodedToken>(token) : null;
    const userId = decodedToken ? parseInt(decodedToken.UserId) : 0;
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState<FeedbackForm>({
        userId: userId,
        subject: '',
        initialMessage: '',
        status: 'Open',
        ratting: 0
    });

    // Fetch a single feedback by ID
    const fetchFeedbackById = async (id: number) => {
        try {
            const response = await API.get<ApiResponse<Feedback>>(`/Feedback/${id}`);
            if (response.data.statusCode === 200 && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching feedback ${id}:`, error);
            return null;
        }
    };

    // Since we can't get all feedbacks, we'll store feedback IDs in localStorage
    const getFeedbackIds = (): number[] => {
        const storedIds = localStorage.getItem(`userFeedbacks_${userId}`);
        return storedIds ? JSON.parse(storedIds) : [];
    };

    const saveFeedbackId = (id: number): void => {
        const ids = getFeedbackIds();
        if (!ids.includes(id)) {
            ids.push(id);
            localStorage.setItem(`userFeedbacks_${userId}`, JSON.stringify(ids));
        }
    };

    // Fetch user's feedbacks
    const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
            const feedbackIds = getFeedbackIds();
            const feedbackPromises = feedbackIds.map(id => fetchFeedbackById(id));
            const feedbackResults = await Promise.all(feedbackPromises);
            const validFeedbacks = feedbackResults.filter(feedback => feedback !== null);
            setFeedbacks(validFeedbacks);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            toast.error('Failed to fetch feedbacks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchFeedbacks();
        }
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (rating: number) => {
        setFormData(prev => ({
            ...prev,
            ratting: rating
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const feedbackData = {
                userId: userId,
                subject: formData.subject,
                initialMessage: formData.initialMessage,
                status: formData.status,
                ratting: formData.ratting
            };

            const response = await API.post<ApiResponse<Feedback>>('/Feedback', feedbackData);
            if (response.data.statusCode === 200 && response.data.data) {
                toast.success('Feedback submitted successfully!');
                saveFeedbackId(response.data.data.feedbackId);
                setFormData({
                    userId: userId,
                    subject: '',
                    initialMessage: '',
                    status: 'Open',
                    ratting: 0
                });
                fetchFeedbacks();
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
            toast.error(errorMessage);
            console.error('Error submitting feedback:', error.response?.data || error);
        }
    };

    const handleDeleteFeedback = async (feedbackId: number) => {
        try {
            const response = await API.delete<ApiResponse<null>>(`/Feedback/${feedbackId}`);
            if (response.data.statusCode === 200) {
                toast.success('Feedback deleted successfully!');
                // Remove the feedback ID from localStorage
                const ids = getFeedbackIds();
                const updatedIds = ids.filter(id => id !== feedbackId);
                localStorage.setItem(`userFeedbacks_${userId}`, JSON.stringify(updatedIds));
                fetchFeedbacks();
                setSelectedFeedback(null);
            }
        } catch (error) {
            toast.error('Failed to delete feedback');
            console.error('Error deleting feedback:', error);
        }
    };

    const handleUpdateStatus = async (feedbackId: number, newStatus: string) => {
        try {
            // Get the current feedback to maintain other fields
            const currentFeedback = feedbacks.find(f => f.feedbackId === feedbackId);
            if (!currentFeedback) {
                toast.error('Feedback not found');
                return;
            }

            const updateData = {
                userId: currentFeedback.userId,
                subject: currentFeedback.subject,
                initialMessage: currentFeedback.initialMessage,
                status: newStatus,
                ratting: currentFeedback.ratting
            };

            const response = await API.put<ApiResponse<Feedback>>(`/Feedback/${feedbackId}`, updateData);
            if (response.data.statusCode === 200) {
                toast.success('Status updated successfully!');
                fetchFeedbacks();
            }
        } catch (error) {
            toast.error('Failed to update status');
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Feedback Form */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Submit Feedback</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter feedback subject"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="initialMessage" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="initialMessage"
                                    name="initialMessage"
                                    value={formData.initialMessage}
                                    onChange={handleChange}
                                    required
                                    placeholder="Describe your feedback in detail"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                                >
                                    <option value="Open">Open</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Rating
                                </label>
                                <div className="flex space-x-2 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(star)}
                                            className={`text-3xl transition-colors duration-200 hover:scale-110 ${formData.ratting >= star ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </div>

                    {/* Feedback List */}
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Feedbacks</h2>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : feedbacks.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No feedbacks yet. Submit your first feedback!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {feedbacks.map((feedback) => (
                                    <div key={feedback.feedbackId} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold">{feedback.subject}</h3>
                                                <p className="text-sm text-gray-600">Rating: {'★'.repeat(feedback.ratting)}</p>
                                                <p className="text-sm text-gray-500 mt-1">{feedback.initialMessage}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <select
                                                    value={feedback.status}
                                                    onChange={(e) => handleUpdateStatus(feedback.feedbackId, e.target.value)}
                                                    className="text-sm border rounded px-2 py-1"
                                                >
                                                    <option value="Open">Open</option>
                                                    <option value="InProgress">In Progress</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteFeedback(feedback.feedbackId)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Feedback Messages */}
                                        <FeedbackMessage
                                            feedbackId={feedback.feedbackId}
                                            onMessageSent={fetchFeedbacks}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
