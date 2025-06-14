import { useState } from 'react';
import API from '../../api/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';

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

function Feedback() {
    const { token } = useAuthStore();
    const decodedToken = token ? jwtDecode<DecodedToken>(token) : null;
    const userId = decodedToken ? parseInt(decodedToken.UserId) : 0;

    const [formData, setFormData] = useState<FeedbackForm>({
        userId: userId,
        subject: '',
        initialMessage: '',
        status: 'Open',
        ratting: 0
    });

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

            const response = await API.post('/Feedback', feedbackData);
            if (response.status === 200) {
                toast.success('Feedback submitted successfully!');
                setFormData({
                    userId: userId,
                    subject: '',
                    initialMessage: '',
                    status: 'Open',
                    ratting: 0
                });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to submit feedback. Please try again.';
            toast.error(errorMessage);
            console.error('Error submitting feedback:', error.response?.data || error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
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
                                    title={`${star} star${star > 1 ? 's' : ''}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.ratting > 0 ? `You rated ${formData.ratting} star${formData.ratting > 1 ? 's' : ''}` : 'Click to rate'}
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Feedback;
