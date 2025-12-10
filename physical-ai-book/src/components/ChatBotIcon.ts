import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';

const BACKEND_API_URL = 'http://localhost:8000/api';

export default function ChatBotIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputValue }),
      });

      const data = await response.json();
      const botMessage = { text: data.content, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: 'Sorry, I encountered an error processing your request.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {isOpen && (
        <div style={{
          width: '350px',
          height: '500px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>AI Textbook Assistant</span>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '10px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                margin: '10px 0'
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '18px',
                  backgroundColor: msg.sender === 'user' ? '#007bff' : '#f0f0f0',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  maxWidth: '80%'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: 'left', margin: '10px 0' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '18px',
                  backgroundColor: '#f0f0f0',
                  color: 'black'
                }}>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '10px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about the textbook..."
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px 0 0 4px'
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0 4px 4px 0',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading || !inputValue.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          title="Chat with AI Assistant"
        >
          💬
        </button>
      )}
    </div>
  );
}