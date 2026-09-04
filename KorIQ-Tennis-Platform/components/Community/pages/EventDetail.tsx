import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface EventDetailProps {
  onLoginRequired: (action: string) => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ onLoginRequired }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock event data - in production this would come from API
  const event = {
    id: id || '1',
    name: 'Valentine\'s Tennis Social',
    date: 'Feb 14, 2026',
    time: '2:00 PM',
    location: 'Queen Elizabeth Park Tennis Courts',
    address: '4600 Cambie St, Vancouver, BC',
    host: { id: '3', name: 'Coach Sarah Mitchell', avatar: null },
    groupSize: '20-30 players',
    totalSpots: 30,
    spotsLeft: 12,
    reason: 'Meet someone new',
    price: 25,
    ntrpLevel: '3.0-4.0',
    ageRange: '25-40',
    description: `Join us for a fun Valentine's Day tennis social! This event is perfect for singles looking to meet other tennis enthusiasts.

The event includes:
• Round-robin matches with rotating partners
• Refreshments and snacks provided
• Post-match social mixer
• Prize for best doubles team

Come ready to play and make new connections!`,
    rules: [
      'Arrive 15 minutes early for check-in',
      'Bring your own racket',
      'Appropriate tennis attire required',
      'Good sportsmanship expected',
    ],
    attendees: [
      { id: '1', name: 'Alex T.' },
      { id: '2', name: 'Jennifer L.' },
      { id: '3', name: 'Mike R.' },
    ],
    refundPolicy: {
      full: 'Within 48 hours of payment',
      partial: '48-96 hours after payment (50% refund)',
      none: 'After 96 hours or within 48 hours of event',
    },
  };

  const isPaid = event.price !== null && event.price > 0;

  const handleJoin = () => {
    onLoginRequired(isPaid ? `purchase a ticket ($${event.price})` : 'join this event');
  };

  const handleViewProfile = (hostId: string) => {
    onLoginRequired('view the host\'s profile');
  };

  const handleAccessChat = () => {
    onLoginRequired('access event chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className={`h-48 ${isPaid ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gradient-to-br from-tennis-500 to-tennis-700'} p-6 flex flex-col justify-end`}>
                {isPaid && (
                  <span className="self-start px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-auto">
                    Paid Event
                  </span>
                )}
                <h1 className="text-3xl font-black text-white">{event.name}</h1>
              </div>

              <div className="p-6">
                {/* Quick Info */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-semibold text-gray-900">{event.date} at {event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{event.location}</p>
                      <p className="text-xs text-gray-400">{event.address}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
                    {event.reason}
                  </span>
                  {event.ntrpLevel && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      NTRP {event.ntrpLevel}
                    </span>
                  )}
                  {event.ageRange && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                      Ages {event.ageRange}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="font-bold text-gray-900 mb-3">About This Event</h2>
                  <div className="text-gray-600 whitespace-pre-line">{event.description}</div>
                </div>

                {/* Rules */}
                <div>
                  <h2 className="font-bold text-gray-900 mb-3">Event Rules</h2>
                  <ul className="space-y-2">
                    {event.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-tennis-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Refund Policy (for paid events) */}
            {isPaid && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <h2 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Refund Policy
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded">100%</span>
                    <span className="text-orange-800">{event.refundPolicy.full}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 font-bold rounded">50%</span>
                    <span className="text-orange-800">{event.refundPolicy.partial}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold rounded">0%</span>
                    <span className="text-orange-800">{event.refundPolicy.none}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6">
                {isPaid ? (
                  <p className="text-4xl font-black text-gray-900">${event.price}</p>
                ) : (
                  <p className="text-4xl font-black text-green-600">Free</p>
                )}
                <p className="text-gray-500 text-sm">per person</p>
              </div>

              {/* Spots */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Spots remaining</span>
                  <span className="font-bold text-gray-900">{event.spotsLeft} / {event.totalSpots}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-tennis-500 rounded-full"
                    style={{ width: `${((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100}%` }}
                  />
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoin}
                className={`w-full py-3 ${isPaid ? 'bg-orange-500 hover:bg-orange-400' : 'bg-tennis-600 hover:bg-tennis-500'} text-white font-bold rounded-xl transition-colors mb-4`}
              >
                {isPaid ? `Join Event - $${event.price}` : 'Join Event'}
              </button>

              {/* Chat Button */}
              <button
                onClick={handleAccessChat}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Event Chat
              </button>
            </div>

            {/* Host Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Hosted by</h3>
              <button
                onClick={() => handleViewProfile(event.host.id)}
                className="flex items-center gap-3 w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tennis-500 to-tennis-700 flex items-center justify-center text-white font-bold">
                  {event.host.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{event.host.name}</p>
                  <p className="text-sm text-gray-500">View Profile</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Attendees */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Attendees ({event.totalSpots - event.spotsLeft})
              </h3>
              <div className="space-y-3">
                {event.attendees.slice(0, 5).map((attendee) => (
                  <button
                    key={attendee.id}
                    onClick={() => handleViewProfile(attendee.id)}
                    className="flex items-center gap-3 w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                      {attendee.name.charAt(0)}
                    </div>
                    <span className="text-gray-700">{attendee.name}</span>
                  </button>
                ))}
                {event.attendees.length > 5 && (
                  <p className="text-sm text-gray-500 text-center pt-2">
                    +{event.attendees.length - 5} more
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
