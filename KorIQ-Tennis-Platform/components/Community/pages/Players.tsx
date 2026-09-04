import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  photo?: string;
  city: string;
  ntrpLevel: string;
  playStyle: 'singles' | 'doubles' | 'both';
  availability: string[];
  lookingFor: string[];
  bio: string;
}

interface PlayersProps {
  onLoginRequired: (action: string) => void;
}

// Mock player data
const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Alex T.',
    city: 'Vancouver',
    ntrpLevel: '4.0',
    playStyle: 'both',
    availability: ['Weekends', 'Evenings'],
    lookingFor: ['Competitive Matches', 'Drilling'],
    bio: 'Former college player looking for competitive hitting partners. Available weekends and some weekday evenings.',
  },
  {
    id: '2',
    name: 'Jennifer L.',
    city: 'Burnaby',
    ntrpLevel: '3.5',
    playStyle: 'doubles',
    availability: ['Weekdays', 'Mornings'],
    lookingFor: ['Casual Hits', 'Doubles Partners'],
    bio: 'Looking for doubles partners for league play. Flexible weekday mornings.',
  },
  {
    id: '3',
    name: 'Mike R.',
    city: 'North Vancouver',
    ntrpLevel: '4.5',
    playStyle: 'singles',
    availability: ['Weekends'],
    lookingFor: ['Competitive Matches', 'Tournament Prep'],
    bio: 'Tournament player training for upcoming local competitions. Strong baseline game.',
  },
  {
    id: '4',
    name: 'Sarah K.',
    city: 'Richmond',
    ntrpLevel: '3.0',
    playStyle: 'both',
    availability: ['Evenings', 'Weekends'],
    lookingFor: ['Casual Hits', 'Learning'],
    bio: 'Getting back into tennis after a few years away. Looking for patient hitting partners.',
  },
  {
    id: '5',
    name: 'David C.',
    city: 'Vancouver',
    ntrpLevel: '4.0',
    playStyle: 'singles',
    availability: ['Mornings', 'Weekdays'],
    lookingFor: ['Competitive Matches', 'Drilling'],
    bio: 'Early morning player. Looking for consistent rally partners to improve my game.',
  },
  {
    id: '6',
    name: 'Emma W.',
    city: 'Vancouver',
    ntrpLevel: '3.5',
    playStyle: 'doubles',
    availability: ['Weekends', 'Afternoons'],
    lookingFor: ['Doubles Partners', 'League Play'],
    bio: 'Active in local doubles leagues. Always looking for new partners!',
  },
  {
    id: '7',
    name: 'Chris B.',
    city: 'Coquitlam',
    ntrpLevel: '3.0',
    playStyle: 'both',
    availability: ['Weekends'],
    lookingFor: ['Casual Hits', 'Social Tennis'],
    bio: 'Weekend warrior looking for fun, social tennis. All levels welcome!',
  },
  {
    id: '8',
    name: 'Lisa P.',
    city: 'West Vancouver',
    ntrpLevel: '4.5',
    playStyle: 'singles',
    availability: ['Mornings', 'Weekdays', 'Weekends'],
    lookingFor: ['Competitive Matches', 'Tournament Prep'],
    bio: 'Competitive player with flexible schedule. Let\'s hit!',
  },
];

const Players: React.FC<PlayersProps> = ({ onLoginRequired }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    ntrpRange: 'all',
    playStyle: 'all',
    availability: 'all',
    lookingFor: 'all',
  });

  const filteredPlayers = MOCK_PLAYERS.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNtrp = filters.ntrpRange === 'all' || checkNtrpRange(player.ntrpLevel, filters.ntrpRange);
    const matchesStyle = filters.playStyle === 'all' || player.playStyle === filters.playStyle || player.playStyle === 'both';
    const matchesAvailability = filters.availability === 'all' ||
      player.availability.some(a => a.toLowerCase() === filters.availability.toLowerCase());
    return matchesSearch && matchesNtrp && matchesStyle && matchesAvailability;
  });

  function checkNtrpRange(level: string, range: string): boolean {
    const ntrp = parseFloat(level);
    switch (range) {
      case '2.5-3.0': return ntrp >= 2.5 && ntrp <= 3.0;
      case '3.0-3.5': return ntrp >= 3.0 && ntrp <= 3.5;
      case '3.5-4.0': return ntrp >= 3.5 && ntrp <= 4.0;
      case '4.0-4.5': return ntrp >= 4.0 && ntrp <= 4.5;
      case '4.5+': return ntrp >= 4.5;
      default: return true;
    }
  }

  const getNtrpColor = (level: string) => {
    const ntrp = parseFloat(level);
    if (ntrp >= 4.5) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (ntrp >= 4.0) return 'bg-orange-100 text-orange-600 border-orange-200';
    if (ntrp >= 3.5) return 'bg-orange-50 text-orange-600 border-orange-200';
    return 'bg-orange-50 text-orange-500 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Find Players
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Connect with tennis players in your area. Find hitting partners, practice buddies, or competitive matches.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-players" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-players focus:ring-2 focus:ring-players/20"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.ntrpRange}
              onChange={(e) => setFilters(f => ({ ...f, ntrpRange: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-players focus:ring-2 focus:ring-players/20"
            >
              <option value="all">All Levels</option>
              <option value="2.5-3.0">NTRP 2.5-3.0</option>
              <option value="3.0-3.5">NTRP 3.0-3.5</option>
              <option value="3.5-4.0">NTRP 3.5-4.0</option>
              <option value="4.0-4.5">NTRP 4.0-4.5</option>
              <option value="4.5+">NTRP 4.5+</option>
            </select>
            <select
              value={filters.playStyle}
              onChange={(e) => setFilters(f => ({ ...f, playStyle: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-players focus:ring-2 focus:ring-players/20"
            >
              <option value="all">All Styles</option>
              <option value="singles">Singles</option>
              <option value="doubles">Doubles</option>
            </select>
            <select
              value={filters.availability}
              onChange={(e) => setFilters(f => ({ ...f, availability: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-players focus:ring-2 focus:ring-players/20"
            >
              <option value="all">Any Availability</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="mornings">Mornings</option>
              <option value="evenings">Evenings</option>
            </select>
            <select
              value={filters.lookingFor}
              onChange={(e) => setFilters(f => ({ ...f, lookingFor: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-players focus:ring-2 focus:ring-players/20"
            >
              <option value="all">Looking For...</option>
              <option value="casual">Casual Hits</option>
              <option value="competitive">Competitive Matches</option>
              <option value="drilling">Drilling</option>
              <option value="doubles">Doubles Partners</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 text-sm mb-6">
          {filteredPlayers.length} players found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="bg-white border border-gray-200 border-l-4 border-l-players rounded-xl p-6 hover:shadow-lg hover:bg-gray-50 transition-all group shadow-sm"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-players to-orange-600 flex items-center justify-center text-xl font-bold text-white">
                  {player.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-players transition-colors">
                    {player.name}
                  </h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1">
                    <svg className="w-3 h-3 text-players" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {player.city}
                  </p>
                </div>
              </div>

              {/* NTRP & Play Style */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getNtrpColor(player.ntrpLevel)}`}>
                  NTRP {player.ntrpLevel}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                  {player.playStyle}
                </span>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3 text-players" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {player.availability.map((time) => (
                    <span key={time} className="text-xs text-gray-600">
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Looking For */}
              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-1.5">Looking for</p>
                <div className="flex flex-wrap gap-1.5">
                  {player.lookingFor.map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-orange-50 border border-orange-200 rounded text-xs text-players">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {player.bio}
              </p>

              <Link
                to={`/community/players/${player.id}`}
                className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center shadow-sm hover:shadow-md"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Players;
