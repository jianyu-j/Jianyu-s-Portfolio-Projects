
import React, { useState, useEffect, useRef } from 'react';
import { MessageThread, Message, Coach } from '../../../types';

// --- MOCK DATA FOR COACH MESSAGING ---
const INITIAL_COACH_MESSAGES: MessageThread[] = [
    { 
        id: 'cth1', 
        participantName: 'John Smith', 
        lastMessage: 'Looking forward to our lesson!', 
        lastMessageTime: '1h ago', 
        unread: true, 
        isOnline: true,
        messages: [
            { id: '1', senderName: 'John Smith', content: 'Hi Coach! I saw your profile and would love to book a lesson.', timestamp: 'Jan 18, 9:00am', isMe: false },
            { id: '2', senderName: 'Me', content: 'Hi John! Great to hear from you. What are you looking to work on?', timestamp: 'Jan 18, 9:15am', isMe: true },
            { id: '3', senderName: 'John Smith', content: 'My serve has been inconsistent lately. I want to improve my toss and follow-through.', timestamp: 'Jan 18, 9:30am', isMe: false },
            { id: '4', senderName: 'Me', content: 'Perfect, serve mechanics are my specialty! I have availability Saturday at 2pm or Sunday at 10am. Which works better?', timestamp: 'Jan 18, 9:45am', isMe: true },
            { id: '5', senderName: 'John Smith', content: 'Saturday 2pm is perfect! Where should we meet?', timestamp: 'Jan 18, 10:00am', isMe: false },
            { id: '6', senderName: 'Me', content: 'Let\'s meet at Stanley Park courts. See you there!', timestamp: 'Jan 18, 10:15am', isMe: true },
            { id: '7', senderName: 'John Smith', content: 'Looking forward to our lesson!', timestamp: 'Jan 18, 10:30am', isMe: false },
        ]
    },
    { 
        id: 'cth2', 
        participantName: 'Maria Garcia', 
        lastMessage: 'Thank you for the great session!', 
        lastMessageTime: 'Yesterday', 
        unread: false, 
        isOnline: true, 
        messages: [
            { id: '1', senderName: 'Maria Garcia', content: 'Thank you for the great session!', timestamp: 'Jan 17, 4:00pm', isMe: false },
        ] 
    },
    { 
        id: 'cth3', 
        participantName: 'Alex Thompson', 
        lastMessage: 'Can we reschedule to next week?', 
        lastMessageTime: 'Jan 16', 
        unread: false, 
        isOnline: false, 
        messages: [] 
    },
    { 
        id: 'cth4', 
        participantName: 'Sarah Lee', 
        lastMessage: 'I\'ll bring my new racket!', 
        lastMessageTime: 'Jan 15', 
        unread: false, 
        isOnline: false, 
        messages: [] 
    },
];

// Quick replies for coaches
const COACH_QUICK_REPLIES = [
    { emoji: '📅', text: 'Let me check my availability' },
    { emoji: '✅', text: 'Confirmed!' },
    { emoji: '📍', text: 'Let\'s meet at the courts' },
    { emoji: '⏰', text: 'See you at our scheduled time' },
    { emoji: '🎾', text: 'Great progress today!' },
    { emoji: '📝', text: 'I\'ll send you some drills' },
];

interface CoachMessagingProps {
    coach: Coach;
}

const CoachMessaging: React.FC<CoachMessagingProps> = ({ coach }) => {
    const [threads, setThreads] = useState<MessageThread[]>(INITIAL_COACH_MESSAGES);
    const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedThread?.messages, isTyping]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedThread) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderName: 'Me',
            content: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
        };

        // Update the selected thread
        const updatedThread = {
            ...selectedThread,
            messages: [...selectedThread.messages, newMessage],
            lastMessage: messageInput,
            lastMessageTime: 'Just now',
        };

        setThreads(prev => prev.map(t => t.id === selectedThread.id ? updatedThread : t));
        setSelectedThread(updatedThread);
        setMessageInput('');

        // Simulate typing response
        setTimeout(() => setIsTyping(true), 1500);
        setTimeout(() => {
            setIsTyping(false);
            const replyMessage: Message = {
                id: (Date.now() + 1).toString(),
                senderName: selectedThread.participantName,
                content: 'Got it, thanks Coach!',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false,
            };
            const threadWithReply = {
                ...updatedThread,
                messages: [...updatedThread.messages, replyMessage],
                lastMessage: replyMessage.content,
                lastMessageTime: 'Just now',
            };
            setThreads(prev => prev.map(t => t.id === selectedThread.id ? threadWithReply : t));
            setSelectedThread(threadWithReply);
        }, 3500);
    };

    const handleQuickReply = (text: string) => {
        setMessageInput(text);
    };

    const unreadCount = threads.filter(t => t.unread).length;

    // Thread List View
    if (!selectedThread) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-gray-800 font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                        <span>💬</span> Messages
                        {unreadCount > 0 && (
                            <span className="bg-tennis-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Communicate with your students</p>
                </div>

                {/* Thread List */}
                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                    {threads.map(thread => (
                        <div
                            key={thread.id}
                            onClick={() => {
                                setSelectedThread(thread);
                                // Mark as read
                                setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: false } : t));
                            }}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 ${thread.unread ? 'bg-tennis-50/50' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-tennis-500 to-tennis-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                    {thread.participantName.charAt(0)}
                                </div>
                                {thread.isOnline && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={`font-bold text-gray-800 truncate ${thread.unread ? 'text-tennis-700' : ''}`}>
                                        {thread.participantName}
                                    </h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{thread.lastMessageTime}</span>
                                </div>
                                <p className={`text-sm truncate ${thread.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                                    {thread.lastMessage}
                                </p>
                            </div>
                            {thread.unread && (
                                <div className="w-2.5 h-2.5 bg-tennis-600 rounded-full flex-shrink-0"></div>
                            )}
                        </div>
                    ))}
                </div>

                {threads.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        <p className="text-4xl mb-2">💬</p>
                        <p className="text-sm">No messages yet</p>
                    </div>
                )}
            </div>
        );
    }

    // Conversation View
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <button 
                    onClick={() => setSelectedThread(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
                >
                    ← 
                </button>
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-tennis-500 to-tennis-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        {selectedThread.participantName.charAt(0)}
                    </div>
                    {selectedThread.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{selectedThread.participantName}</h4>
                    <p className="text-xs text-gray-500">
                        {selectedThread.isOnline ? '🟢 Online' : '⚪ Offline'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {selectedThread.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                                msg.isMe 
                                    ? 'bg-tennis-600 text-white rounded-tr-sm' 
                                    : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                            }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                                <span>{selectedThread.participantName.split(' ')[0]} is typing...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {COACH_QUICK_REPLIES.map((reply, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickReply(`${reply.emoji} ${reply.text}`)}
                            className="bg-gray-100 hover:bg-tennis-50 text-gray-700 hover:text-tennis-700 px-3 py-1.5 rounded-full text-xs whitespace-nowrap border border-gray-200 hover:border-tennis-200 transition-all active:scale-95 flex items-center gap-1.5"
                        >
                            <span>{reply.emoji}</span>
                            <span>{reply.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 text-sm text-gray-800 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-tennis-500 border border-gray-200"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="w-12 h-12 bg-tennis-600 hover:bg-tennis-700 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-all shadow-md active:scale-95"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current transform rotate-45">
                            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default CoachMessaging;
