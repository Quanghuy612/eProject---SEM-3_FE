import { useState, useEffect } from 'react';
import API from '../../api/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    UserId: string;
}

interface FeedbackMessage {
    id: number;
    feedbackId: number;
    senderId: number;
    message: string;
    isAgent: boolean;
    createdAt: string;
}

interface FeedbackMessageProps {
    feedbackId: number;
    onMessageSent: () => void;
}

function FeedbackMessage({ feedbackId, onMessageSent }: FeedbackMessageProps) {
    const { token } = useAuthStore();
    const decodedToken = token ? jwtDecode<DecodedToken>(token) : null;
    const senderId = decodedToken ? parseInt(decodedToken.UserId) : 0;

    const [messages, setMessages] = useState<FeedbackMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isAgent, setIsAgent] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editingMessage, setEditingMessage] = useState('');

    // Fetch messages for a feedback
    const fetchMessages = async () => {
        try {
            const response = await API.get(`/FeedbackMessage/feedback/${feedbackId}`);
            if (response.data) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [feedbackId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const messageData = {
                feedbackId,
                message: newMessage
            };

            await API.post(`/FeedbackMessage?senderId=${senderId}&isAgent=${isAgent}`, messageData);
            setNewMessage('');
            fetchMessages();
            onMessageSent();
            toast.success('Message sent successfully!');
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Error sending message:', error);
        }
    };

    const handleUpdateMessage = async (messageId: number) => {
        if (!editingMessage.trim()) return;

        try {
            await API.put(`/FeedbackMessage/${messageId}`, {
                message: editingMessage
            });
            setEditingMessageId(null);
            setEditingMessage('');
            fetchMessages();
            toast.success('Message updated successfully!');
        } catch (error) {
            toast.error('Failed to update message');
            console.error('Error updating message:', error);
        }
    };

    const handleDeleteMessage = async (messageId: number) => {
        try {
            await API.delete(`/FeedbackMessage/${messageId}`);
            fetchMessages();
            toast.success('Message deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete message');
            console.error('Error deleting message:', error);
        }
    };

    const startEditing = (message: FeedbackMessage) => {
        setEditingMessageId(message.id);
        setEditingMessage(message.message);
    };

    return (
        <div className="space-y-4">
            {/* Messages List */}
            <div className="space-y-2">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-3 rounded-lg ${message.isAgent ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                        {editingMessageId === message.id ? (
                            <div className="space-y-2">
                                <textarea
                                    value={editingMessage}
                                    onChange={(e) => setEditingMessage(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    rows={2}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleUpdateMessage(message.id)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingMessageId(null);
                                            setEditingMessage('');
                                        }}
                                        className="text-gray-600 hover:text-gray-800 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <p className="text-sm">{message.message}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEditing(message)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* New Message Input */}
            <div className="mt-4">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={2}
                />
                <div className="flex justify-between items-center mt-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isAgent}
                            onChange={(e) => setIsAgent(e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Send as agent</span>
                    </label>
                    <button
                        onClick={handleSendMessage}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FeedbackMessage;
