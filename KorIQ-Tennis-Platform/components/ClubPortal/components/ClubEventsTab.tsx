import React, { useState } from 'react';

interface ClubEventsTabProps {
  clubId: string;
  clubName: string;
}

type ClubEventAudience = 'coaches' | 'students' | 'both';

interface ClubEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  isFree: boolean;
  price?: number;
  description: string;
  status: 'upcoming' | 'past' | 'cancelled';
  // Audience restriction - who can see and register for this event
  audience: ClubEventAudience;
}

// Mock events
const MOCK_EVENTS: ClubEvent[] = [
  {
    id: '1',
    name: 'Annual Doubles Championship',
    date: '2024-03-01',
    time: '9:00 AM',
    location: 'Main Courts',
    attendees: 24,
    maxAttendees: 32,
    isFree: false,
    price: 25,
    description: 'Our annual doubles tournament! Teams of 2 compete in round-robin and knockout stages.',
    status: 'upcoming',
    audience: 'both',
  },
  {
    id: '2',
    name: 'Coach Training Session',
    date: '2024-02-24',
    time: '10:00 AM',
    location: 'Practice Courts',
    attendees: 8,
    maxAttendees: 12,
    isFree: true,
    description: 'Monthly coach training and development session. Review teaching techniques and strategies.',
    status: 'upcoming',
    audience: 'coaches',
  },
  {
    id: '3',
    name: 'Student Progress Day',
    date: '2024-02-28',
    time: '2:00 PM',
    location: 'All Courts',
    attendees: 18,
    maxAttendees: 30,
    isFree: true,
    description: 'Students showcase their progress. Parents welcome to watch!',
    status: 'upcoming',
    audience: 'students',
  },
  {
    id: '4',
    name: 'Members Social Night',
    date: '2024-02-17',
    time: '6:00 PM',
    location: 'Clubhouse',
    attendees: 45,
    maxAttendees: 50,
    isFree: true,
    description: 'Monthly social gathering for all club members. Drinks and snacks provided.',
    status: 'past',
    audience: 'both',
  },
];

const ClubEventsTab: React.FC<ClubEventsTabProps> = ({ clubId, clubName }) => {
  const [events, setEvents] = useState<ClubEvent[]>(MOCK_EVENTS);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: 20,
    isFree: true,
    price: 0,
    description: '',
    audience: 'both' as ClubEventAudience,
  });

  const filteredEvents = events.filter(e => {
    if (filter === 'upcoming') return e.status === 'upcoming';
    if (filter === 'past') return e.status === 'past';
    return true;
  });

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time || !newEvent.location) return;

    const event: ClubEvent = {
      id: `event-${Date.now()}`,
      name: newEvent.name,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      attendees: 0,
      maxAttendees: newEvent.maxAttendees,
      isFree: newEvent.isFree,
      price: newEvent.isFree ? undefined : newEvent.price,
      description: newEvent.description,
      status: 'upcoming',
      audience: newEvent.audience,
    };

    setEvents([event, ...events]);
    setShowCreateModal(false);
    setNewEvent({
      name: '',
      date: '',
      time: '',
      location: '',
      maxAttendees: 20,
      isFree: true,
      price: 0,
      description: '',
      audience: 'both',
    });
  };

  const getAudienceLabel = (audience: ClubEventAudience) => {
    switch (audience) {
      case 'coaches': return 'Coaches Only';
      case 'students': return 'Students Only';
      case 'both': return 'All Members';
    }
  };

  const getAudienceColor = (audience: ClubEventAudience) => {
    switch (audience) {
      case 'coaches': return 'bg-green-100 text-green-700';
      case 'students': return 'bg-blue-100 text-blue-700';
      case 'both': return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Club Events</h2>
          <p className="text-sm text-gray-500">Manage and host club events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-portal-club text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-portal-club">
          <p className="text-sm text-gray-500">Upcoming Events</p>
          <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.status === 'upcoming').length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Registrations</p>
          <p className="text-2xl font-bold text-gray-900">{events.reduce((acc, e) => acc + e.attendees, 0)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Events This Month</p>
          <p className="text-2xl font-bold text-gray-900">{events.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'past'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-portal-club text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All Events' : f}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div 
              key={event.id} 
              className={`bg-white border border-gray-200 rounded-xl p-5 border-l-4 ${
                event.status === 'past' ? 'border-l-gray-300 opacity-75' : 'border-l-portal-club'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{event.name}</h4>
                    {event.status === 'past' && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">Past</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getAudienceColor(event.audience)}`}>
                    {getAudienceLabel(event.audience)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    event.isFree ? 'bg-green-100 text-green-700' : 'bg-black text-white'
                  }`}>
                    {event.isFree ? 'FREE' : `$${event.price}`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-portal-club" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.attendees}/{event.maxAttendees}
                </div>
              </div>

              {event.status === 'upcoming' && (
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button className="px-4 py-2 bg-portal-club text-white text-sm font-semibold rounded-lg hover:bg-teal-600">
                    View Attendees
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50">
                    Edit Event
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50">
                    Send Update
                  </button>
                  <button className="px-4 py-2 text-red-600 text-sm font-semibold hover:bg-red-50 rounded-lg ml-auto">
                    Cancel Event
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No {filter !== 'all' ? filter : ''} events</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first club event!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-portal-club text-white font-semibold rounded-lg"
            >
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Create Club Event</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Monthly Doubles Tournament"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Main Courts, Clubhouse"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                <input
                  type="number"
                  value={newEvent.maxAttendees}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 20 }))}
                  min="2"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={newEvent.isFree}
                      onChange={() => setNewEvent(prev => ({ ...prev, isFree: true, price: 0 }))}
                      className="text-portal-club focus:ring-portal-club"
                    />
                    <span className="text-sm">Free</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!newEvent.isFree}
                      onChange={() => setNewEvent(prev => ({ ...prev, isFree: false }))}
                      className="text-portal-club focus:ring-portal-club"
                    />
                    <span className="text-sm">Paid</span>
                  </label>
                </div>
                {!newEvent.isFree && (
                  <div className="mt-2">
                    <input
                      type="number"
                      value={newEvent.price}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="Price per person"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club"
                    />
                    <p className="text-xs text-gray-500 mt-1">5% platform fee applies to paid events</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell members about this event..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-club resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Who can attend?</label>
                <div className="space-y-2">
                  {(['both', 'coaches', 'students'] as ClubEventAudience[]).map(audience => (
                    <label 
                      key={audience}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        newEvent.audience === audience
                          ? 'border-portal-club bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="audience"
                        value={audience}
                        checked={newEvent.audience === audience}
                        onChange={() => setNewEvent(prev => ({ ...prev, audience }))}
                        className="text-portal-club focus:ring-portal-club"
                      />
                      <div>
                        <span className="font-medium text-gray-900">{getAudienceLabel(audience)}</span>
                        <p className="text-xs text-gray-500">
                          {audience === 'both' && 'Visible to all club members'}
                          {audience === 'coaches' && 'Only coaches can see and register'}
                          {audience === 'students' && 'Only students can see and register'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={!newEvent.name || !newEvent.date || !newEvent.time || !newEvent.location}
                className="flex-1 py-3 bg-portal-club text-white rounded-xl font-semibold hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubEventsTab;
