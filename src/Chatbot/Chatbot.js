import React, {useState, useRef, useEffect} from 'react';
import {MessageCircle, X, Send} from 'lucide-react';
import './Chatbot.css';
import axios from "axios";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{type: 'bot', content: 'Hello! How can I help you today?'}]);
    const [inputMessage, setInputMessage] = useState('');
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const generateResponse = async (userMessage, useAI = false) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('User not logged in. Please log in to create a trip.');
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:5001/api/chatbot', {question: userMessage, useAI}, {
                headers: {Authorization: `Bearer ${token}`},
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAIResponse = async () => {
        setShowAIPrompt(false);
        const response = await generateResponse(lastUserMessage, true);
        if (response && response.answer) {
            setMessages(prev => [...prev, {type: 'bot', content: response.answer, isAI: true}]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        setMessages(prev => [...prev, {type: 'user', content: inputMessage}]);
        setLastUserMessage(inputMessage); // Store the last user message
        const response = await generateResponse(inputMessage, false);

        if (response?.noMatch) {
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "I couldn't find an answer. Would you like to consult with our AI?",
                isPrompt: true
            }]);
            setShowAIPrompt(true);
        } else if (response?.answer) {
            setMessages(prev => [...prev, {type: 'bot', content: response.answer}]);
        }
        setInputMessage('');
    };

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="chat-toggle-button">
                    <MessageCircle className="h-6 w-6"/>
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Travel Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="close-button">
                            <X className="h-5 w-5"/>
                        </button>
                    </div>
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div key={index}
                                 className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
                                {message.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                                <span>Loading...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef}/>
                    </div>
                    {showAIPrompt && (
                        <div className="ai-prompt">
                            <button onClick={handleAIResponse} className="confirm-ai">Yes</button>
                            <button onClick={() => setShowAIPrompt(false)} className="decline-ai">No</button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="chat-input-form">
                        <div className="input-container">
                            <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                                   placeholder="Type your message..." className="chat-input"/>
                            <button type="submit" className="send-button">
                                <Send className="h-5 w-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;