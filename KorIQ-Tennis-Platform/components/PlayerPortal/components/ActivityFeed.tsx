
import React, { useState, useRef, useEffect } from 'react';

// ============================================
// TYPES
// ============================================
interface Comment {
  id: number;
  user: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

interface ActivityAction {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

interface ActivityItem {
  id: number;
  type: 'match' | 'achievement' | 'connection' | 'streak' | 'rank' | 'challenge' | 'tournament';
  icon: string;
  user: string;
  action: string;
  details?: string | null;
  time: string;
  likes: number;
  comments: Comment[];
  actions: ActivityAction[];
  isLiked?: boolean;
}

interface ActivityFeedProps {
  onChallenge?: (playerName: string) => void;
  onMessage?: (playerName: string) => void;
  onViewProfile?: (playerName: string) => void;
  onViewLeaderboard?: () => void;
}

// ============================================
// MOCK DATA
// ============================================
const mockActivityFeed: ActivityItem[] = [
  {
    id: 1,
    type: 'match',
    icon: 'match',
    user: 'Alex Thompson',
    action: 'won against Maria Garcia',
    details: '6-4, 7-5 at Stanley Park Courts',
    time: '2 hours ago',
    likes: 12,
    comments: [
      { id: 101, user: 'Sarah Lee', text: 'Great match! You were on fire!', time: '1 hour ago', likes: 3 },
      { id: 102, user: 'Tom Brown', text: 'Congrats Alex! Your backhand was incredible', time: '1.5 hours ago', likes: 2 },
      { id: 103, user: 'Mike Chen', text: 'Nice one!', time: '2 hours ago', likes: 1 },
    ],
    actions: [
      { label: 'Congrats', primary: false },
      { label: 'Challenge', primary: true },
    ],
  },
  {
    id: 2,
    type: 'achievement',
    icon: 'achievement',
    user: 'Sarah Lee',
    action: 'earned "5-Win Streak" badge!',
    details: null,
    time: '5 hours ago',
    likes: 8,
    comments: [
      { id: 201, user: 'Alex Thompson', text: 'You\'re unstoppable!', time: '4 hours ago', likes: 2 },
    ],
    actions: [
      { label: 'Nice!', primary: false },
    ],
  },
  {
    id: 3,
    type: 'connection',
    icon: 'connection',
    user: 'James Wilson',
    action: 'connected with you',
    details: null,
    time: 'Yesterday',
    likes: 0,
    comments: [],
    actions: [
      { label: 'Message', primary: false },
      { label: 'View Profile', primary: false },
    ],
  },
  {
    id: 4,
    type: 'streak',
    icon: 'streak',
    user: 'Tom Brown',
    action: 'is on a 5-match win streak!',
    details: null,
    time: '2 days ago',
    likes: 15,
    comments: [
      { id: 401, user: 'Emma Lee', text: 'Insane run! Who can stop you?', time: '1 day ago', likes: 4 },
      { id: 402, user: 'Sarah Lee', text: 'Looking forward to our match next week', time: '1 day ago', likes: 3 },
      { id: 403, user: 'David Kim', text: 'Beast mode activated', time: '2 days ago', likes: 2 },
      { id: 404, user: 'Mike Chen', text: 'Amazing!', time: '2 days ago', likes: 1 },
    ],
    actions: [
      { label: 'Challenge', primary: true },
    ],
  },
  {
    id: 5,
    type: 'rank',
    icon: 'rank',
    user: 'You',
    action: 'moved up to #7 on the Vancouver leaderboard!',
    details: null,
    time: '3 days ago',
    likes: 6,
    comments: [
      { id: 501, user: 'James Wilson', text: 'Keep climbing!', time: '2 days ago', likes: 1 },
      { id: 502, user: 'Alex Thompson', text: 'Nice progress!', time: '3 days ago', likes: 1 },
    ],
    actions: [
      { label: 'View Leaderboard', primary: false },
      { label: 'Share', primary: true },
    ],
  },
  {
    id: 6,
    type: 'challenge',
    icon: 'challenge',
    user: 'Mike Chen',
    action: 'challenged David Kim',
    details: 'Saturday 10am at Jericho Tennis Club',
    time: '3 days ago',
    likes: 4,
    comments: [
      { id: 601, user: 'Tom Brown', text: 'This is gonna be good!', time: '2 days ago', likes: 2 },
    ],
    actions: [
      { label: 'Watch', primary: false },
    ],
  },
  {
    id: 7,
    type: 'tournament',
    icon: 'tournament',
    user: 'Emma Lee',
    action: 'signed up for Vancouver Open',
    details: 'January 25-26, 2025',
    time: '4 days ago',
    likes: 7,
    comments: [],
    actions: [
      { label: 'View Tournament', primary: false },
    ],
  },
];

// Additional activities for "Load More"
const moreActivities: ActivityItem[] = [
  {
    id: 8,
    type: 'match',
    icon: 'match',
    user: 'David Kim',
    action: 'won against Lisa Park',
    details: '6-3, 6-2 at Queen Elizabeth Park',
    time: '5 days ago',
    likes: 9,
    comments: [
      { id: 801, user: 'Mike Chen', text: 'Dominant performance!', time: '4 days ago', likes: 2 },
    ],
    actions: [
      { label: 'Congrats', primary: false },
      { label: 'Challenge', primary: true },
    ],
  },
  {
    id: 9,
    type: 'achievement',
    icon: 'achievement',
    user: 'Lisa Park',
    action: 'earned "Perfect Week" badge!',
    details: '7 days of consecutive practice',
    time: '5 days ago',
    likes: 11,
    comments: [],
    actions: [
      { label: 'Awesome!', primary: false },
    ],
  },
  {
    id: 10,
    type: 'connection',
    icon: 'connection',
    user: 'Kevin Zhang',
    action: 'joined KorIQ',
    details: 'NTRP 4.0 • Looking for practice partners',
    time: '6 days ago',
    likes: 5,
    comments: [],
    actions: [
      { label: 'Welcome', primary: false },
      { label: 'View Profile', primary: false },
    ],
  },
];

// ============================================
// ICON HELPER
// ============================================
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'match':
      return (
        <svg className="w-5 h-5 text-portal-player" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 8v8" />
        </svg>
      );
    case 'achievement':
      return (
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    case 'connection':
      return (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'streak':
      return (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      );
    case 'rank':
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'challenge':
      return (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'tournament':
      return (
        <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

// ============================================
// COMPONENT
// ============================================
const ActivityFeed: React.FC<ActivityFeedProps> = ({
  onChallenge,
  onMessage,
  onViewProfile,
  onViewLeaderboard,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivityFeed);
  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  
  const filters = ['All', 'Matches', 'Achievements', 'Connections'];
  
  // Filter activities based on selected filter
  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Matches') return activity.type === 'match' || activity.type === 'challenge';
    if (activeFilter === 'Achievements') return activity.type === 'achievement' || activity.type === 'streak' || activity.type === 'rank';
    if (activeFilter === 'Connections') return activity.type === 'connection';
    return true;
  });
  
  // Handle like toggle
  const handleLike = (activityId: number) => {
    setActivities(prev => prev.map(a => {
      if (a.id === activityId) {
        return {
          ...a,
          isLiked: !a.isLiked,
          likes: a.isLiked ? a.likes - 1 : a.likes + 1,
        };
      }
      return a;
    }));
  };

  // Handle comment like
  const handleCommentLike = (activityId: number, commentId: number) => {
    setActivities(prev => prev.map(a => {
      if (a.id === activityId) {
        return {
          ...a,
          comments: a.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                isLiked: !c.isLiked,
                likes: c.isLiked ? c.likes - 1 : c.likes + 1,
              };
            }
            return c;
          }),
        };
      }
      return a;
    }));
  };

  // Toggle comments section
  const handleToggleComments = (activityId: number) => {
    setExpandedComments(prev => prev === activityId ? null : activityId);
    setCommentText('');
    // Focus input when opening
    if (expandedComments !== activityId) {
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  // Add new comment
  const handleAddComment = (activityId: number) => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now(),
      user: 'You',
      text: commentText.trim(),
      time: 'Just now',
      likes: 0,
    };

    setActivities(prev => prev.map(a => {
      if (a.id === activityId) {
        return {
          ...a,
          comments: [newComment, ...a.comments],
        };
      }
      return a;
    }));
    setCommentText('');
  };

  // Load more activities
  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setActivities(prev => [...prev, ...moreActivities]);
      setHasMore(false); // No more after this batch
      setIsLoading(false);
    }, 800);
  };
  
  // Handle action button click
  const handleAction = (action: ActivityAction, activity: ActivityItem) => {
    if (action.label.includes('Challenge') && onChallenge) {
      onChallenge(activity.user);
    } else if (action.label.includes('Message') && onMessage) {
      onMessage(activity.user);
    } else if (action.label.includes('View Profile') && onViewProfile) {
      onViewProfile(activity.user);
    } else if (action.label.includes('Leaderboard') && onViewLeaderboard) {
      onViewLeaderboard();
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h1 className="text-gray-800 text-2xl font-bold flex items-center gap-2">
          ACTIVITY
        </h1>
      </div>

      {/* ===== FILTER TABS ===== */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`
              px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 font-bold
              ${activeFilter === filter 
                ? 'bg-tennis-600 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ===== ACTIVITY CARDS ===== */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div 
            key={activity.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Activity Content */}
            <div className="p-5">
              <div className="flex gap-4 mb-3">
                {/* Icon */}
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Text */}
                <div className="flex-1">
                  <p className="text-gray-900 leading-snug">
                    <span className="font-bold text-gray-900">{activity.user}</span>
                    {' '}{activity.action}
                  </p>
                  {activity.details && (
                    <p className="text-gray-500 text-sm mt-1">{activity.details}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1.5 font-medium">{activity.time}</p>
                </div>
              </div>
              
              {/* Engagement Row */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-2">
                {/* Like Button */}
                <button 
                  onClick={() => handleLike(activity.id)}
                  className={`flex items-center gap-1.5 transition-colors text-sm font-bold ${
                    activity.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <span className={activity.isLiked ? 'text-red-500' : ''}>{activity.isLiked ? '♥' : '♡'}</span>
                  <span>{activity.likes}</span>
                </button>
                
                {/* Comments Button */}
                <button 
                  onClick={() => handleToggleComments(activity.id)}
                  className={`flex items-center gap-1.5 transition-colors text-sm font-bold ${
                    expandedComments === activity.id ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <span>{activity.comments.length}</span>
                </button>
                
                {/* Action Buttons */}
                <div className="flex-1 flex justify-end gap-2 flex-wrap">
                  {activity.actions.map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => handleAction(action, activity)}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                        ${action.primary 
                          ? 'bg-tennis-600 text-white hover:bg-tennis-700 shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                      `}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== COMMENTS SECTION (Instagram-style) ===== */}
            {expandedComments === activity.id && (
              <div className="bg-gray-50 border-t border-gray-100">
                {/* Comment Input */}
                <div className="p-4 border-b border-gray-100 bg-white">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-tennis-100 rounded-full flex items-center justify-center text-tennis-600 font-bold text-sm flex-shrink-0">
                      Y
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        ref={commentInputRef}
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(activity.id)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500"
                      />
                      <button
                        onClick={() => handleAddComment(activity.id)}
                        disabled={!commentText.trim()}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                          commentText.trim() 
                            ? 'bg-tennis-600 text-white hover:bg-tennis-700' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="max-h-64 overflow-y-auto">
                  {activity.comments.length > 0 ? (
                    activity.comments.map((comment) => (
                      <div key={comment.id} className="p-4 border-b border-gray-100 last:border-0">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                            {comment.user.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-bold text-gray-800">{comment.user}</span>
                              <span className="text-gray-600 ml-2">{comment.text}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-1.5">
                              <span className="text-xs text-gray-400">{comment.time}</span>
                              <button
                                onClick={() => handleCommentLike(activity.id, comment.id)}
                                className={`text-xs font-bold transition-colors ${
                                  comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                                }`}
                              >
                                <span className={comment.isLiked ? 'text-red-500' : ''}>{comment.isLiked ? '♥' : '♡'}</span> {comment.likes > 0 && comment.likes}
                              </button>
                              <button className="text-xs text-gray-400 hover:text-gray-600 font-bold">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      <p className="text-sm">No comments yet</p>
                      <p className="text-xs mt-1">Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== LOAD MORE ===== */}
      <div className="mt-8 text-center pb-8">
        {hasMore ? (
          <button 
            onClick={handleLoadMore}
            disabled={isLoading}
            className={`text-sm font-bold uppercase tracking-wide transition-all px-6 py-2.5 rounded-full border ${
              isLoading 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'text-tennis-600 border-tennis-200 hover:bg-tennis-50 hover:text-tennis-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Activity...'
            )}
          </button>
        ) : (
          <p className="text-gray-400 text-sm">You're all caught up!</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
