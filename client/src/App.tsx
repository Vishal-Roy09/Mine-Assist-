import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './components/ChatBubble';
import TypingDots from './components/TypingDots';

interface Message {
  text: string;
  isUser: boolean;
  act?: string;
  section?: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { text: inputValue, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3001/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      });

      const data = await response.json();
      const botMessage: Message = { text: data.answer, isUser: false, act: data.act, section: data.section };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage: Message = {
        text: 'Sorry, something went wrong. Please try again.',
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[600px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float">
              <span className="text-white text-sm">⛏️</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">MineAssist</h1>
          </div>
          <button
            onClick={handleClearChat}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium text-white border border-white/20 hover:border-white/40"
          >
            Clear Chat
          </button>
        </div>

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center animate-slide-up">
              <div className="text-6xl mb-4 animate-float">⛏️</div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to MineAssist</h2>
              <p className="text-white/80 mb-8 text-lg">Your AI assistant for mining regulations and compliance</p>
              <div className="space-y-3 max-w-md mx-auto">
                <button
                  onClick={() => setInputValue('What is the penalty for illegal mining?')}
                  className="block w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 text-white hover:text-white transform hover:scale-105"
                >
                  💰 What is the penalty for illegal mining?
                </button>
                <button
                  onClick={() => setInputValue('What are the safety requirements for mines?')}
                  className="block w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 text-white hover:text-white transform hover:scale-105"
                >
                  🛡️ What are the safety requirements for mines?
                </button>
                <button
                  onClick={() => setInputValue('Tell me about environmental regulations for mining')}
                  className="block w-full text-left p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200 text-white hover:text-white transform hover:scale-105"
                >
                  🌱 Environmental regulations for mining
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="animate-fade-in">
              <ChatBubble message={message} />
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white text-sm">🤖</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-6">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about mining regulations..."
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
              />
              {inputValue && (
                <button
                  onClick={() => setInputValue('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="hidden sm:inline">Send</span>
              <span className="sm:hidden">➤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;


