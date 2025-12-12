import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from "./style.module.css";

const ChatBotUI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: 'Welcome! Ask me anything about Physical AI Humanoid Robotics.', isBot: true }]);
    const [input, setInput] = useState('');
    const bodyRef = useRef<HTMLDivElement>(null);

    const { siteConfig: { customFields } } = useDocusaurusContext();

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { text: input, isBot: false }]);
        const question = input;
        setInput('');

        try {
            // Call backend API
            const response = await fetch(`${customFields.backendUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });
            const data = await response.json();

            // Add bot response
            setMessages((prev) => [...prev, { text: data.response, isBot: true }]);
        } catch (error) {
            setMessages((prev) => [...prev, { text: 'Error: Could not get response.', isBot: true }]);
        }
    };

    // Scroll to bottom on new messages
    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, [messages]);

    return (
        <>
            {/* Chatbot Icon */}
            <div className={styles.chatbotIcon} onClick={toggleChat} />

            {/* Chatbot Window */}
            <div className={`${styles.chatbotWindow} ${isOpen ? styles.open : ''}`}>
                <div className={styles.chatbotHeader}>
                    <span>Physical AI Humanoid Robotics Chatbot</span>
                    <button className={styles.closeBtn} onClick={toggleChat}>&times;</button>
                </div>
                <div className={styles.chatbotBody} ref={bodyRef}>
                    {messages.map((msg, idx) => (
                        <p
                            key={idx}
                            style={{
                                textAlign: msg.isBot ? 'left' : 'right',
                                background: msg.isBot ? '#f1f8e9' : '#e0f7fa',
                                padding: '5px',
                                borderRadius: '5px',
                                marginBottom: '5px',
                            }}
                        >
                            {msg.isBot ? (
                                <ReactMarkdown>
                                    {msg.text}
                                </ReactMarkdown>
                            ) : (
                                <p>{msg.text}</p>
                            )}
                        </p>
                    ))}
                </div>
                <div className={styles.chatbotInput}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </>
    );
};

export default ChatBotUI;