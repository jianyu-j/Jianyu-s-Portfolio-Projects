import React, { useState } from 'react';
import { MessageThread, Message } from '../../../types';
import ChatWindow from '../../Chat/ChatWindow';
import ChatList from '../../Chat/ChatList';

interface MessagesTabProps {
  playerId: string;
  playerName: string;
}

// Mock message threads
const MOCK_THREADS: MessageThread[] = [
  {
    id: '1',
    participantId: 'coach1',
    participantName: 'Coach Mike Chen',
    participantPhoto: '',
    lastMessage: 'Your lesson is confirmed for Saturday at 10am',
    lastMessageTime: '2:30 PM',
    unread: true,
    isOnline: true,
    messages: [
      { id: 'm1', content: 'Hi! I\'d like to book a lesson', isMe: true, timestamp: '2:00 PM' },
      { id: 'm2', content: 'Great! When works for you?', isMe: false, timestamp: '2:15 PM' },
      { id: 'm3', content: 'Saturday morning if possible', isMe: true, timestamp: '2:20 PM' },
      { id: 'm4', content: 'Your lesson is confirmed for Saturday at 10am', isMe: false, timestamp: '2:30 PM' },
    ],
  },
  {
    id: '3',
    participantId: 'event1',
    participantName: 'Saturday Morning Hit (Event)',
    participantPhoto: '',
    lastMessage: 'Mike: See everyone tomorrow!',
    lastMessageTime: 'Yesterday',
    unread: true,
    isOnline: true,
    messages: [
      { id: 'm1', content: 'Welcome to the event chat!', isMe: false, timestamp: '2 days ago' },
      { id: 'm2', content: 'Excited for Saturday!', isMe: true, timestamp: 'Yesterday' },
      { id: 'm3', content: 'See everyone tomorrow!', isMe: false, timestamp: 'Yesterday' },
    ],
  },
  {
    id: '4',
    participantId: 'player2',
    participantName: 'Alex Thompson',
    participantPhoto: '',
    lastMessage: 'Good game yesterday!',
    lastMessageTime: 'Mon',
    unread: false,
    isOnline: false,
    messages: [
      { id: 'm1', content: 'Thanks for the match!', isMe: false, timestamp: 'Monday 4:00 PM' },
      { id: 'm2', content: 'Good game yesterday!', isMe: true, timestamp: 'Monday 4:30 PM' },
    ],
  },
  {
    id: '5',
    participantId: 'player3',
    participantName: 'Tennis Crew (Group)',
    participantPhoto: '',
    lastMessage: 'Jake: Anyone free Thursday?',
    lastMessageTime: 'Mon',
    unread: false,
    isOnline: false,
    messages: [
      { id: 'm1', content: 'Anyone free Thursday?', isMe: false, timestamp: 'Monday' },
    ],
  },
];

const MessagesTab: React.FC<MessagesTabProps> = ({ playerId, playerName }) => {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_THREADS);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleSelectThread = (thread: MessageThread) => {
    // Mark as read
    setThreads(prev => prev.map(t => 
      t.id === thread.id ? { ...t, unread: false } : t
    ));
    setSelectedThread(thread);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedThread) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      content,
      isMe: true,
      timestamp: 'Just now',
    };

    setThreads(prev => prev.map(t => 
      t.id === selectedThread.id 
        ? { 
            ...t, 
            messages: [...t.messages, newMessage],
            lastMessage: content,
            lastMessageTime: 'Just now',
          } 
        : t
    ));

    setSelectedThread(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastMessage: content,
      lastMessageTime: 'Just now',
    } : null);
  };

  const handleBlock = () => {
    if (!selectedThread) return;
    // In real app, would call API
    alert(`Blocked ${selectedThread.participantName}`);
    setSelectedThread(null);
    setThreads(prev => prev.filter(t => t.id !== selectedThread.id));
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  // Mobile: Show either list or chat
  // Desktop: Show both side by side
  return (
    <div className="h-[calc(100vh-180px)] flex flex-col md:flex-row gap-0 md:gap-4">
      {/* Thread List */}
      <div className={`${selectedThread ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white border border-gray-200 rounded-xl overflow-hidden`}>
        <ChatList
          threads={threads}
          onSelectThread={handleSelectThread}
          selectedThreadId={selectedThread?.id}
          showFilters={true}
          accentColor="bg-portal-player"
        />
      </div>

      {/* Chat Window */}
      {selectedThread ? (
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <ChatWindow
            thread={selectedThread}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedThread(null)}
            onBlock={handleBlock}
            onReport={handleReport}
            currentUserName={playerName}
          />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 bg-white border border-gray-200 rounded-xl items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Select a conversation</h3>
            <p className="text-sm text-gray-500">Choose from your existing conversations</p>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Report {selectedThread.participantName}</h3>
            <div className="space-y-2 mb-6">
              {['Harassment', 'Spam', 'Inappropriate content', 'Fake profile', 'Other'].map(reason => (
                <button
                  key={reason}
                  onClick={() => {
                    alert(`Report submitted: ${reason}`);
                    setShowReportModal(false);
                  }}
                  className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full py-3 border border-gray-300 rounded-xl font-semibold text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesTab;
