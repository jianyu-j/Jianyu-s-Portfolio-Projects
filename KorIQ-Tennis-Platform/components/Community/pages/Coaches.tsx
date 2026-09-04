import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Coach {
  id: string;
  name: string;
  photo?: string;
  location: string;
  ntrpLevel: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  bio: string;
  hourlyRate?: number;
  isIndependent: boolean;
  clubName?: string;
}

interface CoachesProps {
  onLoginRequired: (action: string) => void;
}

// Mock coach data
const MOCK_COACHES: Coach[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    location: 'Vancouver, BC',
    ntrpLevel: 'PTR Certified',
    specialties: ['Beginners', 'Juniors', 'Technique'],
    rating: 4.9,
    reviewCount: 127,
    bio: 'Former WTA player with 15 years of coaching experience. Specializing in building strong fundamentals and competitive play for all ages.',
    hourlyRate: 85,
    isIndependent: false,
    clubName: 'Stanley Park Tennis Club',
  },
  {
    id: '2',
    name: 'Marcus Chen',
    location: 'Vancouver, BC',
    ntrpLevel: 'USPTA Elite',
    specialties: ['Competition', 'Adults', 'Strategy'],
    rating: 4.8,
    reviewCount: 89,
    bio: 'NCAA Division I player turned coach. Focus on tactical development and match preparation for competitive players.',
    hourlyRate: 95,
    isIndependent: true,
  },
  {
    id: '3',
    name: 'Elena Volkov',
    location: 'Burnaby, BC',
    ntrpLevel: 'PTR Professional',
    specialties: ['Juniors', 'High Performance', 'Tournament Prep'],
    rating: 5.0,
    reviewCount: 64,
    bio: 'Russian tennis academy graduate. Developing the next generation of competitive junior players.',
    hourlyRate: 110,
    isIndependent: false,
    clubName: 'Burnaby Tennis Academy',
  },
  {
    id: '4',
    name: 'James O\'Connor',
    location: 'North Vancouver, BC',
    ntrpLevel: 'USPTA Certified',
    specialties: ['Adults', 'Seniors', 'Fitness'],
    rating: 4.7,
    reviewCount: 156,
    bio: 'Specializing in adult tennis programs. Whether you\'re picking up a racket for the first time or returning after years away.',
    hourlyRate: 70,
    isIndependent: true,
  },
  {
    id: '5',
    name: 'Lisa Park',
    location: 'Richmond, BC',
    ntrpLevel: 'PTR Certified',
    specialties: ['Beginners', 'Women\'s Tennis', 'Doubles'],
    rating: 4.9,
    reviewCount: 93,
    bio: 'Creating a welcoming environment for new players. Women\'s tennis specialist with a focus on doubles strategy.',
    hourlyRate: 75,
    isIndependent: false,
    clubName: 'Richmond Tennis Centre',
  },
  {
    id: '6',
    name: 'David Kim',
    location: 'Vancouver, BC',
    ntrpLevel: 'USPTA Elite',
    specialties: ['Competition', 'Juniors', 'College Prep'],
    rating: 4.8,
    reviewCount: 71,
    bio: 'Helping junior players achieve their college tennis dreams. Extensive network with US college programs.',
    hourlyRate: 120,
    isIndependent: true,
  },
];

const Coaches: React.FC<CoachesProps> = ({ onLoginRequired }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: 'all',
    type: 'all',
    priceRange: 'all',
  });

  const filteredCoaches = MOCK_COACHES.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coach.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = filters.specialty === 'all' ||
      coach.specialties.some(s => s.toLowerCase() === filters.specialty.toLowerCase());
    const matchesType = filters.type === 'all' ||
      (filters.type === 'independent' ? coach.isIndependent : !coach.isIndependent);
    return matchesSearch && matchesSpecialty && matchesType;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-coaches' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Find Tennis Coaches
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Connect with certified tennis professionals in your area. Find the perfect coach to help you reach your goals.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-coaches" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coaches focus:ring-2 focus:ring-coaches/20"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.specialty}
              onChange={(e) => setFilters(f => ({ ...f, specialty: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-coaches focus:ring-2 focus:ring-coaches/20"
            >
              <option value="all">All Specialties</option>
              <option value="beginners">Beginners</option>
              <option value="juniors">Juniors</option>
              <option value="adults">Adults</option>
              <option value="competition">Competition</option>
              <option value="doubles">Doubles</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-coaches focus:ring-2 focus:ring-coaches/20"
            >
              <option value="all">All Coaches</option>
              <option value="independent">Independent</option>
              <option value="club">Club Affiliated</option>
            </select>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(f => ({ ...f, priceRange: e.target.value }))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-coaches focus:ring-2 focus:ring-coaches/20"
            >
              <option value="all">Any Price</option>
              <option value="under75">Under $75/hr</option>
              <option value="75to100">$75-$100/hr</option>
              <option value="over100">$100+/hr</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-600 text-sm mb-6">
          {filteredCoaches.length} coaches found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-white border border-gray-200 border-l-4 border-l-coaches rounded-xl overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all group shadow-sm"
            >
              <div className="p-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coaches to-green-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                    {coach.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-coaches transition-colors truncate">
                      {coach.name}
                    </h3>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-coaches" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {coach.location}
                    </p>
                    <p className="text-coaches text-xs font-medium mt-1 px-2 py-0.5 bg-green-50 rounded-full inline-block">{coach.ntrpLevel}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(coach.rating)}
                  <span className="text-gray-900 font-semibold text-sm">{coach.rating}</span>
                  <span className="text-gray-500 text-sm">({coach.reviewCount} reviews)</span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {coach.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {coach.bio}
                </p>

                {/* Club affiliation */}
                {coach.clubName && (
                  <p className="text-xs text-gray-500 mb-4">
                    At: {coach.clubName}
                  </p>
                )}

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {coach.hourlyRate && (
                    <span className="text-gray-900 font-bold">
                      ${coach.hourlyRate}<span className="text-gray-500 font-normal text-sm">/hr</span>
                    </span>
                  )}
                  <Link
                    to={`/community/coaches/${coach.id}`}
                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coaches;
