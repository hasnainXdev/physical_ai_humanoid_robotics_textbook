import React from 'react';
import { AuthProvider } from '@site/src/contexts/AuthContext';
import ChatBotUI from '../components/ChatbotUI';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ChatBotUI/>
      {children}
    </AuthProvider>
  );
}