import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Club {
  id: string;
  name: string;
  photo?: string;
  address: string;
  type: 'public' | 'private' | 'semi-private';
  courts: number;
  surfaces: string[];
  amenities: string[];
  description: string;
}

interface ClubsProps {
  onLoginRequired: (action: string) => void;
}

// Mock club data
const MOCK_CLUBS: Club[] = [
  {
    id: '1',
    name: 'Stanley Park Tennis Club',
    address: '610 Pipeline Rd, Vancouver, BC',
    type: 'public',
    courts: 17,
    surfaces: ['Hard'],
    amenities: ['Pro Shop', 'Lessons', 'Tournaments', 'Lights'],
    description: 'Vancouver\'s premier public tennis facility with 17 hard courts, professional instruction, and year-round programming.',
  },
  {
    id: '2',
    name: 'Jericho Tennis Club',
    address: '3837 Point Grey Rd, Vancouver, BC',
    type: 'semi-private',
    courts: 12,
    surfaces: ['Clay', 'Hard'],
    amenities: ['Clubhouse', 'Restaurant', 'Pro Shop', 'Pool', 'Lessons'],
    description: 'Historic tennis club offering clay and hard courts with stunning ocean views. Active membership community and social events.',
  },
  {
    id: '3',
    name: 'Vancouver Lawn Tennis Club',
    address: '1630 W 15th Ave, Vancouver, BC',
    type: 'private',
    courts: 8,
    surfaces: ['Grass', 'Hard'],
    amenities: ['Clubhouse', 'Fine Dining', 'Pro Shop', 'Gym'],
    description: 'Exclusive private club featuring one of the few grass court facilities in Western Canada. Traditional tennis atmosphere.',
  },
  {
    id: '4',
    name: 'UBC Tennis Centre',
    address: '6160 Thunderbird Blvd, Vancouver, BC',
    type: 'public',
    courts: 10,
    surfaces: ['Hard', 'Indoor'],
    amenities: ['Indoor Courts', 'Lessons', 'Pro Shop', 'Fitness Centre'],
    description: 'State-of-the-art facility with both indoor and outdoor courts. Home to UBC varsity tennis and open to the public.',
  },
  {
    id: '5',
    name: 'Burnaby Tennis Academy',
    address: '3795 Canada Way, Burnaby, BC',
    type: 'semi-private',
    courts: 8,
    surfaces: ['Hard', 'Indoor'],
    amenities: ['Indoor Courts', 'Junior Programs', 'Tournaments', 'Pro Shop'],
    description: 'Elite training facility focused on junior development and competitive players. Indoor and outdoor courts available.',
  },
  {
    id: '6',
    name: 'Richmond Tennis Centre',
    address: '5900 Minoru Blvd, Richmond, BC',
    type: 'public',
    courts: 6,
    surfaces: ['Hard'],
    amenities: ['Lessons', 'Tournaments', 'Lights'],
    description: 'Community tennis centre offering affordable court rentals and programming for all ages and skill levels.',
  },
];

const Clubs: React.FC<ClubsProps> = ({ onLoginRequired }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    amenity: 'all',
    surface: 'all',
  });

  const filteredClubs = MOCK_CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type === 'all' || club.type === filters.type;
    const matchesSurface = filters.surface === 'all' || club.surfaces.some(s => s.toLowerCase() === filters.surface);
    return matchesSearch && matchesType && matchesSurface;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-100 text-green-700 border-green-200';
      case 'private': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'semi-private': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Find Tennis Clubs
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Discover tennis clubs and facilities in your area. From public courts to private memberships, find the perfect place to play.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clubs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-clubs focus:ring-2 focus:ring-clubs/20"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.type}
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-clubs focus:ring-2 focus:ring-clubs/20"
            >
              <option value="all">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="semi-private">Semi-Private</option>
            </select>
            <select
              value={filters.surface}
              onChange={(e) => setFilters(f => ({ ...f, surface: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-clubs focus:ring-2 focus:ring-clubs/20"
            >
              <option value="all">All Surfaces</option>
              <option value="hard">Hard Court</option>
              <option value="clay">Clay</option>
              <option value="grass">Grass</option>
              <option value="indoor">Indoor</option>
            </select>
            <select
              value={filters.amenity}
              onChange={(e) => setFilters(f => ({ ...f, amenity: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-clubs focus:ring-2 focus:ring-clubs/20"
            >
              <option value="all">Any Amenities</option>
              <option value="pool">Pool</option>
              <option value="gym">Gym/Fitness</option>
              <option value="restaurant">Restaurant</option>
              <option value="indoor">Indoor Courts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 text-sm mb-6">
          {filteredClubs.length} clubs found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-white border border-gray-200 border-l-4 border-l-clubs rounded-xl overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all group shadow-sm"
            >
              {/* Club Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-teal-50 to-white flex items-center justify-center relative overflow-hidden">
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(club.type)} capitalize`}>
                  {club.type.replace('-', ' ')}
                </div>
                <svg className="w-20 h-20 text-clubs/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-clubs transition-colors">
                  {club.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-clubs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {club.address}
                </p>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {club.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4 text-clubs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {club.courts} courts
                  </span>
                  {club.surfaces.map((surface) => (
                    <span key={surface} className="px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-sm text-clubs font-medium">
                      {surface}
                    </span>
                  ))}
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {club.amenities.slice(0, 4).map((amenity) => (
                    <span key={amenity} className="text-xs text-gray-500">
                      {amenity}
                    </span>
                  ))}
                  {club.amenities.length > 4 && (
                    <span className="text-xs text-gray-500">+{club.amenities.length - 4} more</span>
                  )}
                </div>

                <Link
                  to={`/community/clubs/${club.id}`}
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
