import React, { useState } from 'react';
import { NtrpLevel } from '../../../types';
import EventForm from '../../Community/components/EventForm';

interface MatchUpTabProps {
  playerId: string;
  playerName: string;
  playerNtrp?: NtrpLevel;
}

interface PlayerCard {
  id: string;
  name: string;
  ntrp: string;
  city: string;
  availability: string;
  playStyle: string;
  lastActive: string;
  isConnected: boolean;
  isPending: boolean;
}

interface EventCard {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  hostName: string;
  attendees: number;
  maxAttendees: number;
  ntrpRange?: string;
  isFree: boolean;
  price?: number;
  isJoined: boolean;
  isHosted: boolean;
}

// Mock players
const MOCK_PLAYERS: PlayerCard[] = [
  { id: '1', name: 'Alex Thompson', ntrp: '3.5', city: 'Vancouver, BC', availability: 'Weekends', playStyle: 'Aggressive Baseliner', lastActive: '2 hours ago', isConnected: true, isPending: false },
  { id: '2', name: 'Maria Garcia', ntrp: '3.5', city: 'Vancouver, BC', availability: 'Evenings', playStyle: 'All-Court', lastActive: '1 hour ago', isConnected: false, isPending: true },
  { id: '3', name: 'James Wilson', ntrp: '4.0', city: 'Burnaby, BC', availability: 'Mornings', playStyle: 'Serve & Volley', lastActive: 'Just now', isConnected: false, isPending: false },
  { id: '4', name: 'Sarah Lee', ntrp: '3.0', city: 'Vancouver, BC', availability: 'Flexible', playStyle: 'Defensive', lastActive: '3 hours ago', isConnected: false, isPending: false },
  { id: '5', name: 'Mike Chen', ntrp: '3.5', city: 'Richmond, BC', availability: 'Weekends', playStyle: 'Aggressive Baseliner', lastActive: 'Yesterday', isConnected: true, isPending: false },
];

// Mock events
const MOCK_EVENTS: EventCard[] = [
  { id: '1', name: 'Saturday Morning Social Hit', date: 'Sat, Feb 15', time: '9:00 AM', location: 'Stanley Park Courts', hostName: 'Mike C.', attendees: 8, maxAttendees: 12, ntrpRange: '3.0-4.0', isFree: true, isJoined: true, isHosted: false },
  { id: '2', name: 'Doubles Mixer', date: 'Sun, Feb 16', time: '2:00 PM', location: 'Queen Elizabeth Park', hostName: 'Sarah J.', attendees: 6, maxAttendees: 8, isFree: true, isJoined: false, isHosted: false },
  { id: '3', name: 'Competitive Singles', date: 'Sat, Feb 22', time: '10:00 AM', location: 'Vancouver Tennis Club', hostName: 'You', attendees: 4, maxAttendees: 8, ntrpRange: '3.5-4.5', isFree: false, price: 15, isJoined: true, isHosted: true },
];

const MatchUpTab: React.FC<MatchUpTabProps> = ({ playerId, playerName, playerNtrp }) => {
  const [activeSubTab, setActiveSubTab] = useState<'partners' | 'events'>('partners');
  const [players, setPlayers] = useState<PlayerCard[]>(MOCK_PLAYERS);
  const [events, setEvents] = useState<EventCard[]>(MOCK_EVENTS);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventsFilter, setEventsFilter] = useState<'all' | 'joined' | 'hosted'>('all');

  // Filters for partners
  const [filters, setFilters] = useState({
    ntrp: '',
    location: '',
    availability: '',
  });

  const filteredPlayers = players.filter(p => {
    if (filters.ntrp && p.ntrp !== filters.ntrp) return false;
    if (filters.location && !p.city.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.availability && p.availability !== filters.availability) return false;
    return true;
  });

  const filteredEvents = events.filter(e => {
    if (eventsFilter === 'joined') return e.isJoined && !e.isHosted;
    if (eventsFilter === 'hosted') return e.isHosted;
    return true;
  });

  const handleConnect = (playerId: string) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, isPending: true } : p
    ));
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, isJoined: true, attendees: e.attendees + 1 } : e
    ));
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSubTab('partners')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors relative ${
            activeSubTab === 'partners'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Find Partners
          {activeSubTab === 'partners' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-matchup" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('events')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors relative ${
            activeSubTab === 'events'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Events
          {activeSubTab === 'events' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-matchup" />
          )}
        </button>
      </div>

      {/* Find Partners Sub-tab */}
      {activeSubTab === 'partners' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl">
            <select
              value={filters.ntrp}
              onChange={(e) => setFilters(prev => ({ ...prev, ntrp: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-matchup"
            >
              <option value="">Any NTRP</option>
              {Object.values(NtrpLevel).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-matchup"
            />
            <select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-matchup"
            >
              <option value="">Any Availability</option>
              <option value="Mornings">Mornings</option>
              <option value="Evenings">Evenings</option>
              <option value="Weekends">Weekends</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          {/* My Connections */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-matchup">
            <h3 className="font-semibold text-gray-900 mb-3">My Connections ({players.filter(p => p.isConnected).length})</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {players.filter(p => p.isConnected).map(player => (
                <div key={player.id} className="flex-shrink-0 w-24 text-center">
                  <div className="w-12 h-12 bg-matchup/20 rounded-full flex items-center justify-center font-bold text-matchup mx-auto mb-1">
                    {player.name.charAt(0)}
                  </div>
                  <p className="text-xs font-medium text-gray-900 truncate">{player.name.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500">{player.ntrp}</p>
                </div>
              ))}
              {players.filter(p => p.isPending).length > 0 && (
                <div className="flex-shrink-0 w-24 text-center opacity-60">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center font-bold text-yellow-600 mx-auto mb-1">
                    {players.filter(p => p.isPending).length}
                  </div>
                  <p className="text-xs font-medium text-gray-600">Pending</p>
                </div>
              )}
            </div>
          </div>

          {/* Player Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlayers.map(player => (
              <div key={player.id} className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-players hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-players/20 rounded-full flex items-center justify-center font-bold text-players">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-500">{player.city}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                    {player.ntrp}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p><span className="text-gray-400">Style:</span> {player.playStyle}</p>
                  <p><span className="text-gray-400">Available:</span> {player.availability}</p>
                  <p className="text-xs text-gray-400">Active {player.lastActive}</p>
                </div>
                <div className="flex gap-2">
                  {player.isConnected ? (
                    <>
                      <button className="flex-1 py-2 bg-matchup text-white text-sm font-semibold rounded-lg hover:bg-sky-600">
                        Challenge
                      </button>
                      <button className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50">
                        Message
                      </button>
                    </>
                  ) : player.isPending ? (
                    <button disabled className="flex-1 py-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-lg">
                      Request Pending
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleConnect(player.id)}
                      className="flex-1 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Sub-tab */}
      {activeSubTab === 'events' && (
        <div className="space-y-4">
          {/* Event Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'joined', 'hosted'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setEventsFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    eventsFilter === f
                      ? 'bg-matchup text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All Events' : f === 'joined' ? 'My Events' : 'Hosted'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
            >
              Create Event
            </button>
          </div>

          {/* Event Cards */}
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-5 border-l-4 border-l-matchup hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{event.name}</h4>
                    <p className="text-sm text-gray-500">Hosted by {event.hostName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      event.isFree ? 'bg-green-100 text-green-700' : 'bg-black text-white'
                    }`}>
                      {event.isFree ? 'FREE' : `$${event.price}`}
                    </span>
                    {event.isJoined && (
                      <span className="px-2 py-0.5 bg-matchup/20 text-matchup text-xs font-medium rounded">
                        {event.isHosted ? 'Hosted by you' : 'Joined'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date} • {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.attendees}/{event.maxAttendees} going
                  </div>
                  {event.ntrpRange && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-matchup" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      NTRP {event.ntrpRange}
                    </div>
                  )}
                </div>

                {!event.isJoined && (
                  <button 
                    onClick={() => handleJoinEvent(event.id)}
                    disabled={event.attendees >= event.maxAttendees}
                    className={`w-full py-2.5 font-semibold rounded-lg transition-colors ${
                      event.attendees >= event.maxAttendees
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {event.attendees >= event.maxAttendees ? 'Full - Join Waitlist' : event.isFree ? 'Join Event' : `Join - $${event.price}`}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Apply to Host */}
          <div className="p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-2">Want to host paid events?</p>
            <button className="text-matchup font-medium text-sm hover:underline">
              Apply to Host Paid Event →
            </button>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          eventCategory="Match Up"
          hostId={playerId}
          hostName={playerName}
          hostType="Player"
          onSubmit={(eventData) => {
            console.log('Event created:', eventData);
            setShowEventForm(false);
          }}
          onClose={() => setShowEventForm(false)}
        />
      )}
    </div>
  );
};

export default MatchUpTab;
