import React, { useState } from 'react';

interface ClubEventsViewTabProps {
  clubId: string;
  clubName: string;
  userType: 'coach' | 'student';
  userName: string;
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
  hostName: string;
  isRegistered: boolean;
  audience: ClubEventAudience;
}

// Mock events
const createMockEvents = (): ClubEvent[] => [
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
    hostName: 'Vancouver Tennis Academy',
    isRegistered: false,
    audience: 'both',
  },
  {
    id: '2',
    name: 'Beginner Open Clinic',
    date: '2024-02-24',
    time: '10:00 AM',
    location: 'Practice Courts',
    attendees: 12,
    maxAttendees: 16,
    isFree: true,
    description: 'Free clinic for beginners. Learn the basics of tennis from our certified coaches.',
    status: 'upcoming',
    hostName: 'Coach Mike Chen',
    isRegistered: true,
    audience: 'students',
  },
  {
    id: '3',
    name: 'Junior Development Camp',
    date: '2024-03-15',
    time: '8:00 AM',
    location: 'All Courts',
    attendees: 18,
    maxAttendees: 24,
    isFree: false,
    price: 50,
    description: '3-day intensive camp for junior players. Focus on technique, strategy, and match play.',
    status: 'upcoming',
    hostName: 'Coach Sarah Mitchell',
    isRegistered: false,
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
    description: 'Monthly social gathering for members. Drinks and snacks provided.',
    status: 'past',
    hostName: 'Vancouver Tennis Academy',
    isRegistered: true,
    audience: 'both',
  },
  {
    id: '5',
    name: 'Coaching Techniques Workshop',
    date: '2024-03-10',
    time: '2:00 PM',
    location: 'Conference Room',
    attendees: 8,
    maxAttendees: 15,
    isFree: true,
    description: 'Monthly workshop for coaches to share and learn new coaching techniques.',
    status: 'upcoming',
    hostName: 'Head Coach Williams',
    isRegistered: false,
    audience: 'coaches',
  },
];

const ClubEventsViewTab: React.FC<ClubEventsViewTabProps> = ({ clubId, clubName, userType, userName }) => {
  const [events, setEvents] = useState<ClubEvent[]>(createMockEvents());
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'registered'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);

  const portalColor = userType === 'coach' ? 'portal-coach' : 'portal-student';
  const hoverColor = userType === 'coach' ? 'green-600' : 'blue-600';

  // Filter events based on audience - users only see events meant for them
  const canSeeEvent = (event: ClubEvent) => {
    if (event.audience === 'both') return true;
    if (userType === 'coach' && event.audience === 'coaches') return true;
    if (userType === 'student' && event.audience === 'students') return true;
    return false;
  };

  const getAudienceLabel = (audience: ClubEventAudience) => {
    switch (audience) {
      case 'coaches': return 'Coaches Only';
      case 'students': return 'Students Only';
      case 'both': return 'All Members';
    }
  };

  const filteredEvents = events
    .filter(canSeeEvent) // First filter by audience
    .filter(e => {
      if (filter === 'upcoming') return e.status === 'upcoming';
      if (filter === 'registered') return e.isRegistered;
      return true;
    });

  const handleRegister = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, isRegistered: !e.isRegistered, attendees: e.isRegistered ? e.attendees - 1 : e.attendees + 1 }
        : e
    ));
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => prev ? {
        ...prev,
        isRegistered: !prev.isRegistered,
        attendees: prev.isRegistered ? prev.attendees - 1 : prev.attendees + 1
      } : null);
    }
  };

  // Only count events the user can see
  const visibleEvents = events.filter(canSeeEvent);
  const upcomingCount = visibleEvents.filter(e => e.status === 'upcoming').length;
  const registeredCount = visibleEvents.filter(e => e.isRegistered).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Club Events</h2>
          <p className="text-sm text-gray-500">Events at {clubName}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-${portalColor}`}>
          <p className="text-sm text-gray-500">Upcoming Events</p>
          <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
        </div>
        <div className={`bg-white border border-gray-200 rounded-xl p-4 border-l-4 border-l-${portalColor}`}>
          <p className="text-sm text-gray-500">My Registrations</p>
          <p className="text-2xl font-bold text-gray-900">{registeredCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['upcoming', 'registered', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === f
                ? `bg-${portalColor} text-white`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={filter === f ? { backgroundColor: userType === 'coach' ? '#22C55E' : '#3B82F6' } : {}}
          >
            {f === 'all' ? 'All Events' : f === 'registered' ? 'My Events' : 'Upcoming'}
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
                event.status === 'past' ? 'border-l-gray-300 opacity-75' : 
                userType === 'coach' ? 'border-l-portal-coach' : 'border-l-portal-student'
              } hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-gray-900 text-lg">{event.name}</h4>
                    {event.status === 'past' && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">Past</span>
                    )}
                    {event.isRegistered && event.status !== 'past' && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        userType === 'coach' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        Registered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  {event.audience !== 'both' && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                      {getAudienceLabel(event.audience)}
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    event.isFree ? 'bg-green-100 text-green-700' : 'bg-black text-white'
                  }`}>
                    {event.isFree ? 'FREE' : `$${event.price}`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className={`w-4 h-4 ${userType === 'coach' ? 'text-portal-coach' : 'text-portal-student'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className={`w-4 h-4 ${userType === 'coach' ? 'text-portal-coach' : 'text-portal-student'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {event.time}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className={`w-4 h-4 ${userType === 'coach' ? 'text-portal-coach' : 'text-portal-student'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className={`w-4 h-4 ${userType === 'coach' ? 'text-portal-coach' : 'text-portal-student'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {event.attendees}/{event.maxAttendees}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Hosted by {event.hostName}</span>
                {event.status === 'upcoming' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegister(event.id);
                    }}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      event.isRegistered 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : userType === 'coach' 
                          ? 'bg-portal-coach text-white hover:bg-green-600'
                          : 'bg-portal-student text-white hover:bg-blue-600'
                    }`}
                  >
                    {event.isRegistered ? 'Cancel' : 'Register'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No events found</h3>
            <p className="text-sm text-gray-500">
              {filter === 'registered' 
                ? "You haven't registered for any events yet." 
                : "Check back later for upcoming events."}
            </p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className={`p-6 border-b border-gray-200 ${
              userType === 'coach' ? 'bg-green-50' : 'bg-blue-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{selectedEvent.name}</h3>
                  {selectedEvent.isRegistered && selectedEvent.status !== 'past' && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      userType === 'coach' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      Registered
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">{selectedEvent.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Time</p>
                  <p className="font-semibold text-gray-900">{selectedEvent.time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Location</p>
                  <p className="font-semibold text-gray-900">{selectedEvent.location}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Spots</p>
                  <p className="font-semibold text-gray-900">
                    {selectedEvent.attendees}/{selectedEvent.maxAttendees}
                    {selectedEvent.attendees >= selectedEvent.maxAttendees && (
                      <span className="text-red-500 text-xs ml-1">(Full)</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Hosted by</p>
                  <p className="font-medium text-gray-900">{selectedEvent.hostName}</p>
                </div>
                <span className={`px-3 py-1.5 text-sm font-bold rounded ${
                  selectedEvent.isFree ? 'bg-green-100 text-green-700' : 'bg-black text-white'
                }`}>
                  {selectedEvent.isFree ? 'FREE' : `$${selectedEvent.price}`}
                </span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedEvent.status === 'upcoming' && (
                <button
                  onClick={() => handleRegister(selectedEvent.id)}
                  disabled={!selectedEvent.isRegistered && selectedEvent.attendees >= selectedEvent.maxAttendees}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedEvent.isRegistered 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : userType === 'coach' 
                        ? 'bg-portal-coach text-white hover:bg-green-600'
                        : 'bg-portal-student text-white hover:bg-blue-600'
                  }`}
                >
                  {selectedEvent.isRegistered ? 'Cancel Registration' : 'Register Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubEventsViewTab;
