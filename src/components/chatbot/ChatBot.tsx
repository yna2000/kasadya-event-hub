
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hi there! 👋 Welcome to Kasadya Marketplace. How can I help you today?',
    sender: 'bot',
    timestamp: new Date(),
  },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage('');
    
    // Simulate thinking
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };
  
  const getBotResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('book') || lowercaseMessage.includes('reservation')) {
      return 'To book a service, browse our vendors page, select a vendor and service you like, then click the "Book Now" button. You\'ll need to select a date and time that works for you!';
    } else if (lowercaseMessage.includes('payment') || lowercaseMessage.includes('pay')) {
      return 'We accept various payment methods including credit cards, bank transfers, and cash payments. You can select your preferred method during checkout.';
    } else if (lowercaseMessage.includes('cancel') || lowercaseMessage.includes('reschedule')) {
      return 'To cancel or reschedule a booking, please go to your dashboard, find the booking and click on "Manage Booking". From there you can make the necessary changes.';
    } else if (lowercaseMessage.includes('vendor') || lowercaseMessage.includes('service provider')) {
      return 'To become a vendor on our platform, please register an account and select "Vendor" as your account type. You\'ll need to verify your identity and wait for admin approval before you can start posting your services.';
    } else if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
      return 'Hello! How can I assist you with Kasadya Marketplace today?';
    } else if (lowercaseMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else if (lowercaseMessage.includes('contact') || lowercaseMessage.includes('support') || lowercaseMessage.includes('help')) {
      return 'For additional support, you can reach our team through the Contact page or email us at support@kasadya-marketplace.com.';
    } else {
      return 'I\'m not sure I understand. Could you please rephrase your question? You can ask about booking services, payment methods, vendor registration, or any other questions about Kasadya Marketplace.';
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full shadow-lg bg-kasadya-purple hover:bg-kasadya-deep-purple"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
      
      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-80 md:w-96">
          {/* Chat Header */}
          <div className="bg-kasadya-purple text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <h3 className="font-medium">Kasadya Support</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-kasadya-deep-purple rounded-full"
                onClick={toggleMinimize}
              >
                {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-white hover:bg-kasadya-deep-purple rounded-full"
                onClick={toggleChat}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-3 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-kasadya-purple text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Input */}
              <div className="border-t border-gray-200 p-3 flex items-center bg-white">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="ml-2 bg-kasadya-purple hover:bg-kasadya-deep-purple"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
