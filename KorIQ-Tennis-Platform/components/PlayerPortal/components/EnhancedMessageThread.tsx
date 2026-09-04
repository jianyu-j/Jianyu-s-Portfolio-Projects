
import React, { useState, useEffect, useRef } from 'react';
import TypingIndicator from './TypingIndicator';
import QuickReplyBar from './QuickReplyBar';
import AvailabilityCard, { AvailabilityData } from './AvailabilityCard';

interface Message {
  id: number;
  sender: 'you' | 'them';
  text?: string;
  type?: 'text' | 'availability';
  availabilityData?: AvailabilityData;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastActive: string;
  isTyping: boolean;
}

const mockContact: Contact = {
  name: 'Alex Thompson',
  isOnline: true,
  lastActive: '2 hours ago',
  isTyping: false,
};

const initialMessages: Message[] = [
  { id: 1, sender: 'them', text: 'Hey, want to play this weekend?', time: '10:30 AM' },
  { id: 2, sender: 'you', text: 'Sure! Saturday morning works for me', time: '10:35 AM', status: 'read' },
  { id: 3, sender: 'you', type: 'availability', availabilityData: { saturday: ['Morning', 'Afternoon'], sunday: ['Morning'], weekdays: true }, time: '10:36 AM', status: 'read' },
];

const EnhancedMessageThread: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text?: string, type: 'text' | 'availability' = 'text', availData?: AvailabilityData) => {
    const content = text || inputValue;
    if (!content && type === 'text') return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'you',
      text: content,
      type,
      availabilityData: availData,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    if (type === 'availability') setShowAvailabilityModal(false);

    // Simulate Network Delay & Reply
    setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m));
    }, 1000);

    setTimeout(() => setIsTyping(true), 2000);
    
    setTimeout(() => {
      setIsTyping(false);
      const replyText = type === 'availability' ? 'Thanks! I\'ll check my calendar.' : 'Sounds good to me!';
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'them',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      // Update status of sent message to read
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m));
    }, 4500);
  };

  const handleQuickReply = (text: string) => {
    handleSendMessage(text);
  };

  const handleShareAvailability = (data: AvailabilityData) => {
    handleSendMessage(undefined, 'availability', data);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl font-sans relative">
      
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/5 absolute top-0 w-full z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm border-2 border-slate-700">
              {mockContact.name.charAt(0)}
            </div>
            {mockContact.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight">{mockContact.name}</h3>
            <p className="text-[10px] text-gray-400 font-medium">{mockContact.isOnline ? 'Active now' : `Active ${mockContact.lastActive}`}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors text-xl leading-none px-2 rounded-full hover:bg-white/5 h-8 w-8">⋮</button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-20 p-4 space-y-6 bg-slate-900 scroll-smooth">
        {/* Date Separator */}
        <div className="text-center my-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] ${msg.sender === 'you' ? 'items-end' : 'items-start'} flex flex-col`}>
              
              {msg.type === 'availability' ? (
                <AvailabilityCard mode="view" data={msg.availabilityData} />
              ) : (
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.sender === 'you' 
                    ? 'bg-slate-800 text-white rounded-tr-sm border border-white/10' 
                    : 'bg-[#a3e635] text-slate-900 rounded-tl-sm font-medium'
                }`}>
                  {msg.text}
                </div>
              )}
              
              <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium opacity-80`}>
                <span className="text-gray-500">{msg.time}</span>
                {msg.sender === 'you' && (
                  <span className={msg.status === 'read' ? 'text-[#a3e635]' : 'text-gray-500'}>
                    {msg.status === 'sent' ? '✓' : '✓✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-tl-none p-3 shadow-md">
              <TypingIndicator name={mockContact.name.split(' ')[0]} />
            </div>
          </div>
        )}
        <div className="h-4"></div> {/* Bottom spacer */}
      </div>

      {/* Input Area */}
      <div className="bg-slate-800/90 backdrop-blur-md p-3 border-t border-white/5 relative z-20">
        <div className="mb-3">
          <QuickReplyBar onReply={handleQuickReply} />
        </div>
        
        <div className="flex gap-2 items-center bg-slate-900/80 p-1.5 rounded-full border border-white/10 shadow-inner">
          <button 
            onClick={() => setShowAvailabilityModal(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#a3e635] hover:bg-white/5 transition-all active:scale-95"
            title="Share Availability"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 px-2 h-10"
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            className="w-10 h-10 bg-[#a3e635] hover:bg-[#84cc16] text-slate-900 rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500 transition-all shadow-md active:scale-95 transform hover:-rotate-45 disabled:hover:rotate-0"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transform rotate-45"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"></path></svg>
          </button>
        </div>
      </div>

      {/* Availability Modal Overlay */}
      {showAvailabilityModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <AvailabilityCard mode="select" onShare={handleShareAvailability} onClose={() => setShowAvailabilityModal(false)} />
        </div>
      )}
      
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default EnhancedMessageThread;
