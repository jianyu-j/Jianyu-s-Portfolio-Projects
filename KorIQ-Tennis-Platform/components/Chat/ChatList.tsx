import React, { useState } from 'react';
import { MessageThread } from '../../types';

interface ChatListProps {
  threads: MessageThread[];
  onSelectThread: (thread: MessageThread) => void;
  selectedThreadId?: string;
  showFilters?: boolean;
  messageLimit?: { used: number; max: number }; // For coaches
  accentColor?: string;
}

type FilterType = 'all' | 'players' | 'coaches' | 'events';

const ChatList: React.FC<ChatListProps> = ({
  threads,
  onSelectThread,
  selectedThreadId,
  showFilters = true,
  messageLimit,
  accentColor = 'bg-gray-900',
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter threads based on search and filter type
  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    // In a real app, threads would have a type property
    const matchesFilter = filter === 'all' || true; // Simplified for now
    return matchesSearch && matchesFilter;
  });

  const formatTime = (timeString: string) => {
    if (timeString.includes('ago') || timeString.includes('now') || 
        timeString === 'Yesterday' || timeString.includes('Mon') || 
        timeString.includes('Tue') || timeString.includes('Wed') ||
        timeString.includes('Thu') || timeString.includes('Fri') ||
        timeString.includes('Sat') || timeString.includes('Sun')) {
      return timeString;
    }
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return timeString;
    
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          {messageLimit && (
            <span className="text-sm text-gray-500">
              {messageLimit.used}/{messageLimit.max} conversations
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
          />
        </div>

        {/* Filter Tabs */}
        {showFilters && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {(['all', 'players', 'coaches', 'events'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f
                    ? `${accentColor} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : 
                 f === 'players' ? 'Players' : 
                 f === 'coaches' ? 'Coaches' : 
                 'Events'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Message limit warning */}
      {messageLimit && messageLimit.used >= messageLimit.max && (
        <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            You've reached your monthly conversation limit.{' '}
            <button className="font-semibold text-yellow-900 hover:underline">
              Upgrade to Coach Gold
            </button>
          </p>
        </div>
      )}

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length > 0 ? (
          filteredThreads.map(thread => (
            <button
              key={thread.id}
              onClick={() => onSelectThread(thread)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                selectedThreadId === thread.id ? 'bg-gray-50' : ''
              } ${thread.unread ? 'bg-blue-50/50' : ''}`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-bold text-gray-600">
                    {thread.participantName.charAt(0)}
                  </span>
                </div>
                {thread.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className={`font-semibold truncate ${thread.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {thread.participantName}
                  </h3>
                  <span className={`text-xs flex-shrink-0 ml-2 ${thread.unread ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                    {formatTime(thread.lastMessageTime)}
                  </span>
                </div>
                <p className={`text-sm truncate ${thread.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {thread.lastMessage || 'No messages yet'}
                </p>
              </div>

              {/* Unread indicator */}
              {thread.unread && (
                <div className={`w-2.5 h-2.5 ${accentColor} rounded-full flex-shrink-0`} />
              )}
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No conversations</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery ? 'Try a different search' : 'Start a conversation!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
