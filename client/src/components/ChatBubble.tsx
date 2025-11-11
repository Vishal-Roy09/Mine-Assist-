import React from 'react';

interface ChatBubbleProps {
  message: {
    text: string;
    isUser: boolean;
    act?: string;
    section?: string;
  };
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-white text-sm">🤖</span>
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
        message.isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none' 
          : 'bg-white/20 backdrop-blur-sm text-white rounded-bl-none border border-white/20'
      } transform transition-all duration-300 hover:scale-105`}>
        {message.act && message.section && (
          <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/20">
            <p className="font-bold text-sm text-blue-300">{message.act}</p>
            <p className="text-xs text-purple-300">{message.section}</p>
          </div>
        )}
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`text-xs mt-2 opacity-70 ${
          message.isUser ? 'text-white/80' : 'text-white/60'
        }`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {message.isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
          <span className="text-white text-sm">👤</span>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;


