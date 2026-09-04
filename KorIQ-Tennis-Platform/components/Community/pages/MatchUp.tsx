import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Partner {
  id: string;
  name: string;
  ntrpLevel: string;
  location: string;
  availability: string[];
  purpose: string[];
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  host: { id: string; name: string };
  groupSize: string;
  spotsLeft: number;
  reason: string;
  price: number | null;
  ntrpLevel?: string;
}

interface MatchUpProps {
  onLoginRequired: (action: string) => void;
}

// Mock data
const MOCK_PARTNERS: Partner[] = [
  { id: '1', name: 'Alex T.', ntrpLevel: '4.0', location: 'Vancouver', availability: ['Weekends', 'Evenings'], purpose: ['Train', 'Social'] },
  { id: '2', name: 'Sarah K.', ntrpLevel: '3.5', location: 'Burnaby', availability: ['Weekdays', 'Mornings'], purpose: ['Social', 'Meet someone new'] },
  { id: '3', name: 'Mike R.', ntrpLevel: '4.5', location: 'North Vancouver', availability: ['Weekends'], purpose: ['Train'] },
  { id: '4', name: 'Jennifer L.', ntrpLevel: '3.0', location: 'Richmond', availability: ['Evenings'], purpose: ['Social', 'Meet someone new'] },
  { id: '5', name: 'David C.', ntrpLevel: '4.0', location: 'Vancouver', availability: ['Mornings', 'Weekdays'], purpose: ['Train'] },
  { id: '6', name: 'Emma W.', ntrpLevel: '3.5', location: 'Vancouver', availability: ['Weekends', 'Afternoons'], purpose: ['Social'] },
];

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Sunday Morning Doubles',
    date: 'Feb 2, 2025',
    time: '9:00 AM',
    location: 'Stanley Park Tennis Courts',
    host: { id: '1', name: 'Alex T.' },
    groupSize: '8 players',
    spotsLeft: 3,
    reason: 'Social',
    price: null,
    ntrpLevel: '3.5-4.0',
  },
  {
    id: '2',
    name: 'Competitive Singles Practice',
    date: 'Feb 3, 2025',
    time: '6:00 PM',
    location: 'Jericho Tennis Club',
    host: { id: '2', name: 'Mike R.' },
    groupSize: '4 players',
    spotsLeft: 1,
    reason: 'Train',
    price: null,
    ntrpLevel: '4.0+',
  },
  {
    id: '3',
    name: 'Valentine\'s Tennis Social',
    date: 'Feb 14, 2025',
    time: '2:00 PM',
    location: 'Queen Elizabeth Park',
    host: { id: '3', name: 'Coach Sarah' },
    groupSize: '20-30 players',
    spotsLeft: 12,
    reason: 'Meet someone new',
    price: 25,
  },
  {
    id: '4',
    name: 'Beginner Friendly Clinic',
    date: 'Feb 8, 2025',
    time: '10:00 AM',
    location: 'Richmond Tennis Centre',
    host: { id: '4', name: 'Coach Marcus' },
    groupSize: '10-20 players',
    spotsLeft: 8,
    reason: 'Train',
    price: 35,
    ntrpLevel: '2.5-3.5',
  },
];

const MatchUp: React.FC<MatchUpProps> = ({ onLoginRequired }) => {
  const [activeSection, setActiveSection] = useState<'partners' | 'events'>('partners');
  const [partnerFilters, setPartnerFilters] = useState({
    ntrpLevel: 'all',
    availability: 'all',
    purpose: 'all',
  });
  const [eventFilters, setEventFilters] = useState({
    type: 'all',
    date: 'all',
  });

  const handleViewProfile = (id: string) => {
    onLoginRequired('view this profile');
  };

  const handleRequestPlay = (id: string) => {
    onLoginRequired('request to play');
  };

  const handleViewEvent = (id: string) => {
    onLoginRequired('view event details');
  };

  const handleJoinEvent = (id: string) => {
    onLoginRequired('join this event');
  };

  const handleCreateEvent = () => {
    onLoginRequired('create an event');
  };

  const handleApplyHost = () => {
    onLoginRequired('apply to host a paid event');
  };

  const getNtrpColor = (level: string) => {
    const ntrp = parseFloat(level);
    if (ntrp >= 4.5) return 'bg-purple-100 text-purple-700';
    if (ntrp >= 4.0) return 'bg-blue-100 text-blue-700';
    if (ntrp >= 3.5) return 'bg-green-100 text-green-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose.toLowerCase()) {
      case 'train': return 'bg-blue-100 text-blue-700';
      case 'social': return 'bg-green-100 text-green-700';
      case 'meet someone new': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Match Up
          </h1>
          <p className="text-gray-600 mb-6">
            Find hitting partners and join tennis events
          </p>

          {/* Section Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection('partners')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeSection === 'partners'
                  ? 'bg-matchup text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Find Partners
            </button>
            <button
              onClick={() => setActiveSection('events')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeSection === 'events'
                  ? 'bg-matchup text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Events
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'partners' ? (
          <>
            {/* Partner Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={partnerFilters.ntrpLevel}
                onChange={(e) => setPartnerFilters(f => ({ ...f, ntrpLevel: e.target.value }))}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-matchup focus:ring-2 focus:ring-matchup/20"
              >
                <option value="all">All Levels</option>
                <option value="3.0">NTRP 3.0</option>
                <option value="3.5">NTRP 3.5</option>
                <option value="4.0">NTRP 4.0</option>
                <option value="4.5">NTRP 4.5+</option>
              </select>
              <select
                value={partnerFilters.availability}
                onChange={(e) => setPartnerFilters(f => ({ ...f, availability: e.target.value }))}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-matchup focus:ring-2 focus:ring-matchup/20"
              >
                <option value="all">Any Availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="mornings">Mornings</option>
                <option value="evenings">Evenings</option>
              </select>
              <select
                value={partnerFilters.purpose}
                onChange={(e) => setPartnerFilters(f => ({ ...f, purpose: e.target.value }))}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-matchup focus:ring-2 focus:ring-matchup/20"
              >
                <option value="all">Any Purpose</option>
                <option value="train">Train</option>
                <option value="social">Social</option>
                <option value="meet">Meet someone new</option>
              </select>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_PARTNERS.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border border-gray-200 border-l-4 border-l-matchup rounded-xl p-6 hover:shadow-lg hover:bg-gray-50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-matchup to-sky-600 flex items-center justify-center text-xl font-bold text-white">
                      {partner.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <svg className="w-3 h-3 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {partner.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getNtrpColor(partner.ntrpLevel)}`}>
                      NTRP {partner.ntrpLevel}
                    </span>
                    {partner.purpose.map((p) => (
                      <span key={p} className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPurposeColor(p)}`}>
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <svg className="w-3 h-3 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Available
                    </p>
                    <p className="text-sm text-gray-600">{partner.availability.join(', ')}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProfile(partner.id)}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleRequestPlay(partner.id)}
                      className="flex-1 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                    >
                      Request to Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Event Actions */}
            <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <select
                  value={eventFilters.type}
                  onChange={(e) => setEventFilters(f => ({ ...f, type: e.target.value }))}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-matchup focus:ring-2 focus:ring-matchup/20"
                >
                  <option value="all">All Events</option>
                  <option value="free">Free Events</option>
                  <option value="paid">Paid Events</option>
                </select>
                <select
                  value={eventFilters.date}
                  onChange={(e) => setEventFilters(f => ({ ...f, date: e.target.value }))}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-matchup focus:ring-2 focus:ring-matchup/20"
                >
                  <option value="all">Any Date</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  Create Free Event
                </button>
                <button
                  onClick={handleApplyHost}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Apply to Host Paid Event
                </button>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_EVENTS.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 border-l-4 border-l-matchup rounded-xl overflow-hidden hover:shadow-lg hover:bg-gray-50 transition-all shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{event.name}</h3>
                        <p className="text-gray-600 text-sm">
                          Hosted by{' '}
                          <button
                            onClick={() => handleViewProfile(event.host.id)}
                            className="text-matchup hover:text-sky-600 font-medium"
                          >
                            {event.host.name}
                          </button>
                        </p>
                      </div>
                      {event.price !== null ? (
                        <span className="px-3 py-1.5 bg-black text-white text-sm font-bold rounded-lg">
                          ${event.price}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-lg">
                          Free
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date} at {event.time}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {event.location}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.groupSize} ({event.spotsLeft} spots left)
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPurposeColor(event.reason)}`}>
                        {event.reason}
                      </span>
                      {event.ntrpLevel && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {event.ntrpLevel}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewEvent(event.id)}
                        className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleJoinEvent(event.id)}
                        className="flex-1 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                      >
                        {event.price !== null ? `Join - $${event.price}` : 'Join Event'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchUp;
