
import React from 'react';
import { Button } from '../../ui/Button';

interface PlayerProfile {
  id: string;
  name: string;
  city: string;
  ntrp: number;
  style?: string;
  bio?: string;
  avatar?: string;
  wins: number;
  losses: number;
  rank?: number;
  achievements: {
    icon: string;
    name: string;
    date?: string;
  }[];
  streaks: {
    type: string;
    count: number;
    icon: string;
  }[];
  preferredCourts: string[];
  availability: { day: string; times: string[] }[];
  recentMatches: {
    opponent: string;
    result: 'W' | 'L';
    score: string;
    date: string;
  }[];
}

interface PlayerProfileViewProps {
  player: PlayerProfile;
  onClose: () => void;
  onMessage?: () => void;
  onChallenge?: () => void;
}

const PlayerProfileView: React.FC<PlayerProfileViewProps> = ({ 
  player, 
  onClose,
  onMessage,
  onChallenge 
}) => {
  const winRate = player.wins + player.losses > 0 
    ? Math.round((player.wins / (player.wins + player.losses)) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header with gradient */}
        <div className="relative h-40 bg-gradient-to-br from-tennis-500 via-tennis-600 to-emerald-600 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="absolute top-4 right-4 opacity-10">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="white" stroke="white"><circle cx="12" cy="12" r="10" strokeWidth="1" /><path strokeWidth="1.5" fill="none" d="M12 2c-2.5 2.5-2.5 6.5 0 10s2.5 7.5 0 10" stroke="rgba(0,0,0,0.3)" /><path strokeWidth="1.5" fill="none" d="M2 12c2.5-2.5 6.5-2.5 10 0s7.5 2.5 10 0" stroke="rgba(0,0,0,0.3)" /></svg>
          </div>
          <div className="absolute bottom-4 left-4 opacity-10">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          >
            ✕
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl border-4 border-white">
              {player.avatar || <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 pb-6 px-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
          {/* Name & Basic Info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-gray-500 text-sm flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {player.city}</span>
                <span className="bg-tennis-100 text-tennis-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  NTRP {player.ntrp}
                </span>
                {player.style && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    {player.style}
                  </span>
                )}
              </div>
            </div>
            {player.rank && (
              <div className="text-right">
                <div className="text-3xl font-bold text-tennis-600">#{player.rank}</div>
                <div className="text-xs text-gray-400 font-bold uppercase">Local Rank</div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">{player.wins}</div>
              <div className="text-xs text-green-600/70 font-bold uppercase">Wins</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 text-center border border-red-100">
              <div className="text-2xl font-bold text-red-500">{player.losses}</div>
              <div className="text-xs text-red-500/70 font-bold uppercase">Losses</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{winRate}%</div>
              <div className="text-xs text-blue-600/70 font-bold uppercase">Win Rate</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 text-center border border-amber-100">
              <div className="text-2xl font-bold text-amber-600">{player.wins + player.losses}</div>
              <div className="text-xs text-amber-600/70 font-bold uppercase">Matches</div>
            </div>
          </div>

          {/* Bio */}
          {player.bio && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                {player.bio}
              </p>
            </div>
          )}

          {/* Achievements & Streaks */}
          {(player.achievements.length > 0 || player.streaks.length > 0) && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Achievements & Streaks</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {player.streaks.map((streak, i) => (
                  <div 
                    key={`streak-${i}`}
                    className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100 text-center"
                  >
                    <div className="text-2xl mb-1">{streak.icon}</div>
                    <div className="text-lg font-bold text-orange-600">{streak.count}</div>
                    <div className="text-xs text-orange-600/70 font-medium">{streak.type}</div>
                  </div>
                ))}
                {player.achievements.map((achievement, i) => (
                  <div 
                    key={`ach-${i}`}
                    className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-100 text-center"
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-bold text-purple-700">{achievement.name}</div>
                    {achievement.date && (
                      <div className="text-[10px] text-purple-400 mt-0.5">{achievement.date}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Matches */}
          {player.recentMatches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Matches</h3>
              <div className="space-y-2">
                {player.recentMatches.slice(0, 3).map((match, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      match.result === 'W' 
                        ? 'bg-green-50/50 border-green-100' 
                        : 'bg-red-50/50 border-red-100'
                    }`}
                  >
                    <span className={`text-xl font-bold ${
                      match.result === 'W' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {match.result}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">vs {match.opponent}</span>
                      <span className="text-gray-400 text-sm ml-2">{match.score}</span>
                    </div>
                    <span className="text-xs text-gray-400">{match.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Courts */}
          {player.preferredCourts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preferred Courts</h3>
              <div className="flex flex-wrap gap-2">
                {player.preferredCourts.map((court, i) => (
                  <span 
                    key={i}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium"
                  >
                    {court}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {player.availability.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {player.availability.map((slot, i) => (
                  slot.times.length > 0 && (
                    <div key={i} className="bg-tennis-50 text-tennis-700 px-3 py-2 rounded-lg border border-tennis-100">
                      <span className="text-xs font-bold uppercase block text-tennis-500">{slot.day}</span>
                      <span className="text-sm font-medium">{slot.times.join(', ')}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={onMessage}
            >
              Message
            </Button>
            <Button 
              className="flex-1"
              onClick={onChallenge}
            >
              Challenge
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PlayerProfileView;

// Mock player data generator for viewing profiles
export const getMockPlayerProfile = (name: string): PlayerProfile => ({
  id: 'mock-' + name.toLowerCase().replace(' ', '-'),
  name,
  city: 'Vancouver, BC',
  ntrp: 4.0,
  style: 'Aggressive Baseliner',
  bio: `Passionate tennis player looking for competitive matches and practice partners. Started playing 5 years ago and have been improving steadily. Love the mental aspect of the game!`,
  wins: 23,
  losses: 12,
  rank: 15,
  achievements: [
    { icon: null, name: 'Tournament Winner', date: 'Dec 2024' },
    { icon: null, name: 'Top 20 Player', date: 'Jan 2025' },
    { icon: null, name: 'Perfect Week', date: 'Jan 2025' },
  ],
  streaks: [
    { type: 'Win Streak', count: 5, icon: null },
    { type: 'Practice Days', count: 12, icon: null },
  ],
  preferredCourts: ['Stanley Park Courts', 'Jericho Tennis Club'],
  availability: [
    { day: 'Mon', times: ['Morning', 'Evening'] },
    { day: 'Wed', times: ['Evening'] },
    { day: 'Sat', times: ['Morning', 'Afternoon'] },
    { day: 'Sun', times: ['Morning'] },
  ],
  recentMatches: [
    { opponent: 'Alex Thompson', result: 'W', score: '6-4, 7-5', date: 'Jan 15' },
    { opponent: 'Sarah Lee', result: 'W', score: '6-3, 6-2', date: 'Jan 12' },
    { opponent: 'Mike Chen', result: 'L', score: '4-6, 3-6', date: 'Jan 8' },
  ],
});
