import React, { useState, useRef, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../utils/api';
const AIChatbot = ({ isOpen, onClose, _userRole }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Assalamu Alaikum! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    try {
      const response = await apiRequest(`${API_ENDPOINTS.AI_BASE}/chatbot`, {
        method: 'POST',
        body: JSON.stringify({ message: inputMessage })
      });
      const botMessage = {
        id: Date.now() + 1,
        text: response.bot_response,
        sender: 'bot',
        timestamp: response.timestamp
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (_error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const quickQuestions = [
    "What's my attendance?",
    "Show my grades",
    "Do I have any fines?",
    "When's my next exam?",
    "How can I improve?"
  ];
  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };
  if (!isOpen) return null;
  return (
    <div className="ai-chatbot-overlay">
      <div className="ai-chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="bot-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h4>AI Assistant</h4>
              <span className="bot-status">
                <i className="fas fa-circle text-success"></i> Online
              </span>
            </div>
          </div>
          <button className="chatbot-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
            >
              <div className="message-content">
                <div className="message-text">
                  {message.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message message-bot">
              <div className="message-content">
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-quick-questions">
          <p>Quick questions:</p>
          <div className="quick-questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        <form className="chatbot-input-form" onSubmit={sendMessage}>
          <div className="input-group">
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ask me anything about your academics..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputMessage.trim() || isLoading}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AIChatbot;
