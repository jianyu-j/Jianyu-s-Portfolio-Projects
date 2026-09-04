import React from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  isEarned: boolean;
  category: 'player' | 'coach' | 'community' | 'achievement';
}

interface BadgeDisplayProps {
  badges: Badge[];
  showUnearned?: boolean;
  compact?: boolean;
}

// Default badge definitions
export const BADGE_DEFINITIONS: Badge[] = [
  // Player Badges
  { id: 'first_rally', name: 'First Rally', description: 'Complete your first match', icon: '🎾', isEarned: false, category: 'player' },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Make 10 connections', icon: '🦋', isEarned: false, category: 'player' },
  { id: 'event_regular', name: 'Event Regular', description: 'Attend 5 events', icon: '📅', isEarned: false, category: 'player' },
  { id: 'tournament_player', name: 'Tournament Player', description: 'Register for your first tournament', icon: '🏆', isEarned: false, category: 'player' },
  
  // Coach Badges
  { id: 'rising_coach', name: 'Rising Coach', description: 'Receive your first 5-star review', icon: '⭐', isEarned: false, category: 'coach' },
  { id: 'tutorial_pro', name: 'Tutorial Pro', description: '10 tutorial purchases', icon: '🎬', isEarned: false, category: 'coach' },
  
  // Community Badges
  { id: 'event_host', name: 'Event Host', description: 'Host your first successful event', icon: '🎪', isEarned: false, category: 'community' },
  { id: 'community_builder', name: 'Community Builder', description: '50 Ball Park posts', icon: '🏗️', isEarned: false, category: 'community' },
  
  // Achievement Badges
  { id: 'verified', name: 'Verified', description: 'Complete photo verification', icon: '✓', isEarned: false, category: 'achievement' },
  { id: 'connector', name: 'Connector', description: 'Successfully refer a friend', icon: '🔗', isEarned: false, category: 'achievement' },
];

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  showUnearned = false,
  compact = false,
}) => {
  const displayBadges = showUnearned 
    ? badges 
    : badges.filter(b => b.isEarned);

  if (displayBadges.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl">🏅</span>
        </div>
        <p className="text-gray-500 text-sm">No badges yet</p>
        <p className="text-gray-400 text-xs mt-1">Keep playing to earn badges!</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {displayBadges.map(badge => (
          <div
            key={badge.id}
            className={`relative group ${!badge.isEarned ? 'opacity-40' : ''}`}
            title={`${badge.name}: ${badge.description}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              badge.isEarned ? 'bg-yellow-100' : 'bg-gray-100'
            }`}>
              {badge.icon}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {badge.name}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {displayBadges.map(badge => (
        <div
          key={badge.id}
          className={`bg-white rounded-xl border border-gray-200 p-4 text-center transition-all ${
            badge.isEarned 
              ? 'hover:shadow-md' 
              : 'opacity-50 grayscale'
          }`}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 ${
            badge.isEarned ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            {badge.icon}
          </div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</h4>
          <p className="text-xs text-gray-500">{badge.description}</p>
          {badge.isEarned && badge.earnedAt && (
            <p className="text-xs text-green-600 mt-2">
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          )}
          {!badge.isEarned && (
            <p className="text-xs text-gray-400 mt-2">Not earned yet</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BadgeDisplay;
