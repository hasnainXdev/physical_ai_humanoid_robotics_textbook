import React, { useState } from 'react';
import styles from './styles.module.css';

const ChatbotUI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        // Placeholder for RAG API call
        // const response = await fetch('/api/rag', {
        //     method: 'POST',
        //     body: JSON.stringify({ query: input })
        // });
        // const data = await response.json();
        
        const botResponse = `This is a placeholder response for "${input}". In a real implementation, this would be the answer from the RAG system.`;
        setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    };

    return (
        <div className={styles.chatbotContainer}>
            <div className={styles.messageArea}>
                {messages.map((msg, index) => (
                    <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a question about the book..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default ChatbotUI;
