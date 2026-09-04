import React, { useState, useEffect, useCallback } from 'react';

interface Court {
  id: string;
  name: string;
  address: string;
  type: 'public' | 'private' | 'club';
  surface: string;
  courts: number;
  hours?: string;
  distance?: string;
  photo?: string;
  lat: number;
  lng: number;
  amenities: string[];
}

interface CourtsProps {
  onLoginRequired: (action: string) => void;
}

// Mock court data (in real app, this would come from Google Places API)
const MOCK_COURTS: Court[] = [
  {
    id: '1',
    name: 'Stanley Park Tennis Courts',
    address: '610 Pipeline Rd, Vancouver, BC V6G 3E2',
    type: 'public',
    surface: 'Hard',
    courts: 17,
    hours: '6:00 AM - 10:00 PM',
    distance: '2.3 mi',
    lat: 49.2988,
    lng: -123.1352,
    amenities: ['Lights', 'Restrooms', 'Pro Shop'],
  },
  {
    id: '2',
    name: 'Jericho Tennis Club',
    address: '3837 Point Grey Rd, Vancouver, BC V6R 1B3',
    type: 'club',
    surface: 'Clay',
    courts: 12,
    hours: '7:00 AM - 9:00 PM',
    distance: '4.1 mi',
    lat: 49.2716,
    lng: -123.2005,
    amenities: ['Lights', 'Restrooms', 'Pro Shop', 'Clubhouse'],
  },
  {
    id: '3',
    name: 'Queen Elizabeth Park Courts',
    address: '4600 Cambie St, Vancouver, BC V5Y 2M4',
    type: 'public',
    surface: 'Hard',
    courts: 18,
    hours: '6:00 AM - Dusk',
    distance: '3.5 mi',
    lat: 49.2413,
    lng: -123.1116,
    amenities: ['Restrooms'],
  },
  {
    id: '4',
    name: 'Vancouver Lawn Tennis Club',
    address: '1630 W 15th Ave, Vancouver, BC V6J 2K7',
    type: 'private',
    surface: 'Grass',
    courts: 8,
    hours: 'Members Only',
    distance: '5.2 mi',
    lat: 49.2563,
    lng: -123.1446,
    amenities: ['Lights', 'Restrooms', 'Pro Shop', 'Clubhouse', 'Restaurant'],
  },
  {
    id: '5',
    name: 'Kitsilano Beach Courts',
    address: '2305 Cornwall Ave, Vancouver, BC V6K 1B6',
    type: 'public',
    surface: 'Hard',
    courts: 4,
    hours: '7:00 AM - 9:00 PM',
    distance: '3.8 mi',
    lat: 49.2725,
    lng: -123.1536,
    amenities: ['Restrooms'],
  },
  {
    id: '6',
    name: 'UBC Tennis Centre',
    address: '6160 Thunderbird Blvd, Vancouver, BC V6T 1Z3',
    type: 'public',
    surface: 'Hard',
    courts: 10,
    hours: '6:00 AM - 11:00 PM',
    distance: '7.5 mi',
    lat: 49.2606,
    lng: -123.2460,
    amenities: ['Lights', 'Restrooms', 'Pro Shop', 'Indoor Courts'],
  },
];

const Courts: React.FC<CourtsProps> = ({ onLoginRequired }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courts, setCourts] = useState<Court[]>(MOCK_COURTS);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    type: 'all',
    surface: 'all',
    distance: 'all',
  });

  // Filter courts based on search and filters
  const filteredCourts = courts.filter(court => {
    const matchesSearch = court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filters.type === 'all' || court.type === filters.type;
    const matchesSurface = filters.surface === 'all' || court.surface.toLowerCase() === filters.surface;
    return matchesSearch && matchesType && matchesSurface;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-100 text-green-700 border-green-200';
      case 'private': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'club': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSurfaceColor = (surface: string) => {
    switch (surface.toLowerCase()) {
      case 'hard': return 'bg-blue-600';
      case 'clay': return 'bg-orange-500';
      case 'grass': return 'bg-green-600';
      case 'indoor': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Find Tennis Courts
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Discover tennis courts near you. Search by location, filter by type and surface, and get directions.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-courts" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-courts focus:ring-2 focus:ring-courts/20"
              />
            </div>
            <button className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.type}
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-courts focus:ring-2 focus:ring-courts/20"
            >
              <option value="all">All Types</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="club">Club</option>
            </select>
            <select
              value={filters.surface}
              onChange={(e) => setFilters(f => ({ ...f, surface: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-courts focus:ring-2 focus:ring-courts/20"
            >
              <option value="all">All Surfaces</option>
              <option value="hard">Hard Court</option>
              <option value="clay">Clay</option>
              <option value="grass">Grass</option>
            </select>
            <select
              value={filters.distance}
              onChange={(e) => setFilters(f => ({ ...f, distance: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-courts focus:ring-2 focus:ring-courts/20"
            >
              <option value="all">Any Distance</option>
              <option value="5">Within 5 mi</option>
              <option value="10">Within 10 mi</option>
              <option value="25">Within 25 mi</option>
            </select>

            {/* View Toggle */}
            <div className="ml-auto flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 text-sm mb-6">
          {filteredCourts.length} courts found
        </p>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                className="bg-white border border-gray-200 border-l-4 border-l-courts rounded-xl overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all group shadow-sm"
              >
                {/* Court Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center relative overflow-hidden">
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border ${getTypeColor(court.type)} capitalize`}>
                    {court.type}
                  </div>
                  <svg className="w-16 h-16 text-courts/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4h16v16H4V4z M4 12h16 M12 4v16" />
                  </svg>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-courts transition-colors">
                    {court.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-courts" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {court.address}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${getSurfaceColor(court.surface)}`}>
                      {court.surface}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {court.courts} courts
                    </span>
                    {court.distance && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {court.distance}
                      </span>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {court.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="text-xs text-gray-500">
                        {amenity}
                      </span>
                    ))}
                    {court.amenities.length > 3 && (
                      <span className="text-xs text-gray-500">+{court.amenities.length - 3} more</span>
                    )}
                  </div>

                  {court.hours && (
                    <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-courts" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {court.hours}
                    </p>
                  )}

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Map View Placeholder */
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-[600px] flex items-center justify-center shadow-sm">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-600 mb-2">Map View</p>
              <p className="text-gray-400 text-sm max-w-md">
                To enable the map view, add your Google Maps API key to the environment variables.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courts;
