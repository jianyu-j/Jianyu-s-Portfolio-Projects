import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface PlayerProfileProps {
  onLoginRequired: (action: string) => void;
}

// Mock player data
const PLAYER_DATA = {
  id: '1',
  name: 'Alex T.',
  city: 'Vancouver',
  ntrpLevel: '4.0',
  playStyle: 'both',
  availability: ['Weekends', 'Evenings'],
  lookingFor: ['Competitive Matches', 'Drilling'],
  bio: 'Former college player looking for competitive hitting partners. I played D3 tennis and have been playing recreationally for the past 5 years. My game is aggressive from the baseline with a strong forehand. Looking to improve my net game and overall consistency.',
  preferredCourts: ['Stanley Park Tennis Courts', 'Jericho Tennis Club'],
  playingFrequency: '3-4 times per week',
  memberSince: 'January 2024',
};

const PlayerProfile: React.FC<PlayerProfileProps> = ({ onLoginRequired }) => {
  const { id } = useParams();
  const player = PLAYER_DATA;

  const getNtrpColor = (level: string) => {
    const ntrp = parseFloat(level);
    if (ntrp >= 4.5) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (ntrp >= 4.0) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (ntrp >= 3.5) return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Back button */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Link
          to="/community/players"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Players
        </Link>
      </div>

      {/* Profile Card */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-4xl font-bold text-white">
              {player.name.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900 mb-2">{player.name}</h1>
              <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {player.city}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${getNtrpColor(player.ntrpLevel)}`}>
              NTRP {player.ntrpLevel}
            </span>
            <span className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 capitalize">
              {player.playStyle === 'both' ? 'Singles & Doubles' : player.playStyle}
            </span>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{player.bio}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-2">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {player.availability.map((time) => (
                  <span key={time} className="px-3 py-1.5 bg-tennis-50 border border-tennis-200 rounded-lg text-sm text-tennis-700">
                    {time}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-2">Looking For</h3>
              <div className="flex flex-wrap gap-2">
                {player.lookingFor.map((item) => (
                  <span key={item} className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-2">Preferred Courts</h3>
              <div className="space-y-1">
                {player.preferredCourts.map((court) => (
                  <p key={court} className="text-gray-600 text-sm">{court}</p>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm text-gray-400 mb-2">Playing Frequency</h3>
              <p className="text-gray-600">{player.playingFrequency}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onLoginRequired('connect with this player')}
              className="flex-1 py-3 bg-tennis-600 hover:bg-tennis-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Connect
            </button>
            <button
              onClick={() => onLoginRequired('challenge this player to a match')}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Challenge to Match
            </button>
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-6 bg-tennis-50 border border-tennis-200 rounded-2xl p-6 text-center">
          <p className="text-gray-900 font-medium mb-2">Want to connect with {player.name.split(' ')[0]}?</p>
          <p className="text-gray-500 text-sm mb-4">Create a free account to send messages and arrange matches.</p>
          <button
            onClick={() => onLoginRequired('connect with this player')}
            className="px-8 py-3 bg-tennis-600 hover:bg-tennis-500 text-white font-semibold rounded-xl transition-colors shadow-sm"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
