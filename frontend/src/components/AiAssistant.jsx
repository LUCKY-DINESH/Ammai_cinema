import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/api';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome! I am your AI Film Historian for "AMMAI: The Mystic Knightess". Ask me anything about Amy Carmichael, the Dohnavur Fellowship sanctuary, the film production, or how you can contribute.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchSuggestions() {
      const list = await aiService.getSuggestions();
      setSuggestions(list);
    }
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (userText) => {
    const text = userText || input;
    if (!text.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: text.trim() }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await aiService.chat(newMessages.filter(m => m.role === 'user' || m.role === 'assistant'));
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Amy Carmichael (1867–1951), affectionately called "Ammai", was an Irish missionary, activist, and writer who devoted 55 continuous years of her life in Southern India without returning home. She battled temple servitude and founded The Dohnavur Fellowship, which still provides shelter and education for children today.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        className="ai-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Cinema Assistant"
        title="Ask Amy AI - Cinema Historian">
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <span className="ai-btn-text">Ask Amy AI</span>
      </button>

      {/* AI Chat Drawer / Modal */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ai-avatar-icon">✨</div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', margin: 0, color: 'var(--color-gold)' }}>
                  Ammai AI Historian
                </h4>
                <span style={{ fontSize: '0.7rem', color: '#aaa' }}>Powered by Groq AI</span>
              </div>
            </div>
            <button 
              className="ai-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant">
              ✕
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="ai-suggestions-bar">
            {suggestions.slice(0, 3).map((s, idx) => (
              <button 
                key={idx} 
                className="ai-suggestion-pill"
                onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="ai-messages-container">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`ai-message-bubble ${m.role}`}>
                <div className="ai-bubble-content">
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message-bubble assistant">
                <div className="ai-bubble-content typing">
                  <span>●</span> <span>●</span> <span>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="ai-input-form">
            <input 
              type="text"
              placeholder="Ask about the film, history, or Dohnavur..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="ai-input-field"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="ai-send-btn">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
