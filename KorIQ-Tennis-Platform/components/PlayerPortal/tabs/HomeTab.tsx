import React from 'react';
import { Player, NtrpLevel } from '../../../types';

interface HomeTabProps {
  player: Player;
  onNavigate: (tab: string) => void;
}

// Mock data for nearby players
const MOCK_NEARBY_PLAYERS = [
  { id: '1', name: 'Alex Thompson', ntrp: '3.5', city: 'Vancouver, BC', lastActive: '2 hours ago' },
  { id: '2', name: 'Maria Garcia', ntrp: '3.5', city: 'Vancouver, BC', lastActive: '1 hour ago' },
  { id: '3', name: 'James Wilson', ntrp: '4.0', city: 'Burnaby, BC', lastActive: 'Just now' },
  { id: '4', name: 'Sarah Lee', ntrp: '3.0', city: 'Vancouver, BC', lastActive: '3 hours ago' },
];

// Mock data for recommended coaches
const MOCK_COACHES = [
  { id: '1', name: 'Coach Mike Chen', rating: 4.9, specialties: ['Serve', 'Strategy'], hourlyRate: 75 },
  { id: '2', name: 'Coach Sarah Mitchell', rating: 4.8, specialties: ['Beginners', 'Juniors'], hourlyRate: 85 },
  { id: '3', name: 'Coach David Park', rating: 4.7, specialties: ['Advanced', 'Competition'], hourlyRate: 90 },
];

// Mock upcoming events
const MOCK_EVENTS = [
  { id: '1', name: 'Saturday Morning Hit', date: 'Sat, Feb 15', time: '9:00 AM', location: 'Stanley Park', attendees: 8, maxAttendees: 12 },
  { id: '2', name: 'Doubles Mixer', date: 'Sun, Feb 16', time: '2:00 PM', location: 'Queen Elizabeth Park', attendees: 6, maxAttendees: 8 },
];

// Mock Ball Park posts
const MOCK_POSTS = [
  { id: '1', author: 'Tennis Vancouver', content: 'Great turnout at yesterday\'s mixer!', likes: 24, time: '2 hours ago' },
  { id: '2', author: 'Mike C.', content: 'Anyone up for a hit tomorrow morning?', likes: 5, time: '4 hours ago' },
];

const HomeTab: React.FC<HomeTabProps> = ({ player, onNavigate }) => {
  // Calculate profile completeness
  const calculateCompleteness = () => {
    let score = 0;
    if (player.name) score += 15;
    if (player.city) score += 15;
    if (player.currentNtrp) score += 15;
    if (player.bio) score += 15;
    if (player.availability) score += 15;
    if (player.preferredCourts && player.preferredCourts.length > 0) score += 15;
    if (player.selfAssessment) score += 10;
    return score;
  };

  const completeness = calculateCompleteness();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {player.name?.split(' ')[0] || 'Player'}!</h1>
        <p className="text-orange-100">Ready to find your next match?</p>
      </div>

      {/* Profile Completeness */}
      {completeness < 100 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-portal-player">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
              <p className="text-sm text-gray-500">A complete profile helps you find better matches</p>
            </div>
            <span className="text-2xl font-bold text-portal-player">{completeness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className="bg-portal-player h-2 rounded-full transition-all" 
              style={{ width: `${completeness}%` }}
            />
          </div>
          <button 
            onClick={() => onNavigate('PROFILE')}
            className="text-sm text-portal-player font-medium hover:underline"
          >
            Complete your profile →
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => onNavigate('MATCH_UP')}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-portal-player transition-all text-center"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-portal-player" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Find Partner</span>
        </button>
        <button 
          onClick={() => onNavigate('BALL_PARK')}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-portal-player transition-all text-center"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Post</span>
        </button>
        <button 
          onClick={() => onNavigate('MATCH_UP')}
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-portal-player transition-all text-center"
        >
          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Events</span>
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players Near You */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-portal-player">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Players Near You</h3>
            <button 
              onClick={() => onNavigate('MATCH_UP')}
              className="text-sm text-portal-player font-medium hover:underline"
            >
              See all →
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_NEARBY_PLAYERS.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">NTRP {p.ntrp} • {p.city}</p>
                </div>
                <span className="text-xs text-gray-400">{p.lastActive}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coaches For You */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-coaches">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Coaches For You</h3>
            <button 
              onClick={() => onNavigate('COACHES')}
              className="text-sm text-coaches font-medium hover:underline"
            >
              See all →
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_COACHES.slice(0, 3).map(coach => (
              <div key={coach.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                  {coach.name.split(' ')[1]?.charAt(0) || coach.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{coach.name}</p>
                  <p className="text-xs text-gray-500">
                    <span className="text-yellow-500">★</span> {coach.rating} • {coach.specialties.join(', ')}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-900">${coach.hourlyRate}/hr</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events This Weekend */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-matchup">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Events This Weekend</h3>
          <button 
            onClick={() => onNavigate('MATCH_UP')}
            className="text-sm text-matchup font-medium hover:underline"
          >
            See all →
          </button>
        </div>
        {MOCK_EVENTS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_EVENTS.map(event => (
              <div key={event.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <h4 className="font-medium text-gray-900 mb-1">{event.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {event.date} • {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {event.location}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{event.attendees}/{event.maxAttendees} going</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">FREE</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No events scheduled this weekend</p>
        )}
      </div>

      {/* New in Ball Park */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-ballpark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">New in Ball Park</h3>
          <button 
            onClick={() => onNavigate('BALL_PARK')}
            className="text-sm text-ballpark font-medium hover:underline"
          >
            See all →
          </button>
        </div>
        <div className="space-y-3">
          {MOCK_POSTS.map(post => (
            <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium text-gray-900 text-sm">{post.author}</span>
                <span className="text-xs text-gray-400">• {post.time}</span>
              </div>
              <p className="text-sm text-gray-600">{post.content}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {post.likes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
