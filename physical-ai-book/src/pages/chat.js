import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const BACKEND_API_URL = 'http://localhost:8000/api/v1';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { siteConfig } = useDocusaurusContext();

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
      const botMessage = { 
        text: data.content, 
        sender: 'bot',
        citations: data.sourceCitations || []
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: 'Sorry, I encountered an error processing your request. Please make sure the backend server is running.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCitations = (citations) => {
    if (!citations || citations.length === 0) return null;

    return (
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd' }}>
        <strong style={{ fontSize: '0.85em' }}>Sources:</strong>
        <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '0.85em' }}>
          {citations.map((citation, idx) => (
            <li key={idx} style={{ marginBottom: '4px' }}>
              {citation.sourceReference}: <em>{citation.quotedText.substring(0, 100)}{citation.quotedText.length > 100 ? '...' : ''}</em>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Layout 
      title={`AI Assistant - ${siteConfig.title}`} 
      description="Chat with the AI assistant based on the physical AI humanoid robotics textbook"
    >
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1>🤖 AI Textbook Assistant</h1>
          <p>Ask questions about <strong>{siteConfig.title}</strong> and get AI-powered answers with citations.</p>
        </div>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '15px', 
          height: '500px', 
          overflowY: 'auto',
          marginBottom: '15px',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.length === 0 ? (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              color: '#666'
            }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📚</div>
                <p>Ask me anything about the Physical AI & Humanoid Robotics textbook!</p>
                <p style={{ fontSize: '0.9em' }}>Try: "What are the key principles of humanoid robotics?"</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                style={{ 
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  margin: '10px 0',
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: msg.sender === 'user' ? '#007bff' : '#ffffff',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  maxWidth: '85%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: msg.sender === 'bot' ? '1px solid #eee' : 'none'
                }}>
                  {msg.text}
                  {msg.sender === 'bot' && msg.citations && formatCitations(msg.citations)}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div 
              style={{ 
                textAlign: 'left', 
                margin: '10px 0',
                display: 'flex',
                justifyContent: 'flex-start'
              }}
            >
              <div style={{
                display: 'inline-block',
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
                color: 'black',
                maxWidth: '85%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #eee'
              }}>
                <div>Thinking...</div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about the textbook..."
            style={{ 
              flex: 1, 
              padding: '12px 15px', 
              border: '1px solid #ddd',
              borderRadius: '20px',
              fontSize: '16px'
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              minWidth: '80px'
            }}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
        
        <div style={{ marginTop: '15px', fontSize: '0.8em', color: '#666', textAlign: 'center' }}>
          <p>This AI assistant uses RAG (Retrieval-Augmented Generation) to provide answers based on the textbook content.</p>
        </div>
      </div>
    </Layout>
  );
}

export default ChatPage;