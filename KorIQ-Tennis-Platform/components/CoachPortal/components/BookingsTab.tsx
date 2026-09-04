import React, { useState } from 'react';
import { BookingRequest, BookingStatus, NtrpLevel } from '../../../types';

interface BookingsTabProps {
  coachId: string;
  onMessagePlayer: (playerId: string, playerName: string) => void;
}

// Mock booking requests
const MOCK_BOOKINGS: BookingRequest[] = [
  {
    id: '1',
    playerId: 'player-1',
    playerName: 'Sarah Johnson',
    playerNtrp: NtrpLevel.L35,
    playerCity: 'Vancouver',
    coachId: 'coach-1',
    coachName: 'Coach Mike',
    lessonType: 'Private',
    preferredDate: '2026-02-15',
    preferredTime: 'Morning',
    duration: '1 hour',
    locationPreference: 'Stanley Park Courts',
    message: 'Looking to improve my serve consistency before a tournament next month.',
    status: 'Pending',
    createdAt: '2026-01-25T10:00:00Z',
    updatedAt: '2026-01-25T10:00:00Z',
  },
  {
    id: '2',
    playerId: 'player-2',
    playerName: 'Mike Chen',
    playerNtrp: NtrpLevel.L40,
    playerCity: 'North Vancouver',
    coachId: 'coach-1',
    coachName: 'Coach Mike',
    lessonType: 'Evaluation',
    preferredDate: '2026-02-18',
    preferredTime: 'Afternoon',
    duration: '1.5 hours',
    message: 'Want to get a professional assessment of my game.',
    status: 'Pending',
    createdAt: '2026-01-24T14:00:00Z',
    updatedAt: '2026-01-24T14:00:00Z',
  },
  {
    id: '3',
    playerId: 'player-3',
    playerName: 'Emily Wong',
    playerNtrp: NtrpLevel.L30,
    playerCity: 'Burnaby',
    coachId: 'coach-1',
    coachName: 'Coach Mike',
    lessonType: 'Private',
    preferredDate: '2026-02-10',
    preferredTime: 'Morning',
    duration: '1 hour',
    status: 'Approved',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-21T08:00:00Z',
  },
  {
    id: '4',
    playerId: 'player-4',
    playerName: 'David Park',
    playerNtrp: NtrpLevel.L45,
    playerCity: 'Vancouver',
    coachId: 'coach-1',
    coachName: 'Coach Mike',
    lessonType: 'Private',
    preferredDate: '2026-01-15',
    preferredTime: 'Afternoon',
    duration: '1 hour',
    status: 'Completed',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z',
  },
];

const BookingsTab: React.FC<BookingsTabProps> = ({ coachId, onMessagePlayer }) => {
  const [bookings, setBookings] = useState<BookingRequest[]>(MOCK_BOOKINGS);
  const [activeSection, setActiveSection] = useState<'pending' | 'upcoming' | 'past'>('pending');
  const [showDeclineModal, setShowDeclineModal] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [showSuggestModal, setShowSuggestModal] = useState<string | null>(null);
  const [suggestedChange, setSuggestedChange] = useState('');

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const upcomingBookings = bookings.filter(b => b.status === 'Approved');
  const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Declined' || b.status === 'Cancelled');

  const currentBookings = {
    pending: pendingBookings,
    upcoming: upcomingBookings,
    past: pastBookings,
  }[activeSection];

  const handleApprove = (id: string) => {
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'Approved' as BookingStatus, updatedAt: new Date().toISOString() } : b
    ));
  };

  const handleDecline = (id: string) => {
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'Declined' as BookingStatus, declineReason, updatedAt: new Date().toISOString() } : b
    ));
    setShowDeclineModal(null);
    setDeclineReason('');
  };

  const handleSuggestChange = (id: string) => {
    // In a real app, this would open a chat with the suggested change
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, suggestedChange, updatedAt: new Date().toISOString() } : b
    ));
    setShowSuggestModal(null);
    setSuggestedChange('');
    alert('Your suggested change has been sent to the player.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Declined: 'bg-red-100 text-red-800',
      Completed: 'bg-gray-100 text-gray-800',
      Cancelled: 'bg-gray-100 text-gray-500',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
        <p className="text-sm text-gray-500">Manage lesson requests and your schedule</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        {([
          { id: 'pending', label: 'Pending', count: pendingBookings.length },
          { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
          { id: 'past', label: 'Past', count: pastBookings.length },
        ] as const).map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeSection === section.id
                ? 'border-portal-coach text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.label}
            {section.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeSection === section.id ? 'bg-portal-coach text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {section.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {currentBookings.length > 0 ? (
        <div className="space-y-4">
          {currentBookings.map(booking => (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-coach p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Player Info */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">
                      {booking.playerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.playerName}</h3>
                    <p className="text-sm text-gray-500">
                      NTRP {booking.playerNtrp} {booking.playerCity && `• ${booking.playerCity}`}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Type</p>
                    <p className="text-sm font-medium text-gray-900">{booking.lessonType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(booking.preferredDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Time</p>
                    <p className="text-sm font-medium text-gray-900">{booking.preferredTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{booking.duration}</p>
                  </div>
                </div>

                {/* Status Badge (for non-pending) */}
                {booking.status !== 'Pending' && (
                  <div className="flex-shrink-0">
                    {getStatusBadge(booking.status)}
                  </div>
                )}
              </div>

              {/* Message */}
              {booking.message && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">"{booking.message}"</p>
                </div>
              )}

              {/* Location */}
              {booking.locationPreference && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{booking.locationPreference}</span>
                </div>
              )}

              {/* Actions */}
              {booking.status === 'Pending' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(booking.id)}
                    className="px-4 py-2 bg-portal-coach text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setShowDeclineModal(booking.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setShowSuggestModal(booking.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Suggest Change
                  </button>
                  <button
                    onClick={() => onMessagePlayer(booking.playerId, booking.playerName)}
                    className="px-4 py-2 text-portal-coach border border-portal-coach rounded-lg font-medium hover:bg-green-50 transition-colors"
                  >
                    Message Player
                  </button>
                </div>
              )}

              {booking.status === 'Completed' && (
                <div className="mt-4">
                  <button className="px-4 py-2 text-sm text-portal-coach font-medium hover:underline">
                    Request Review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            No {activeSection} bookings
          </h3>
          <p className="text-gray-500">
            {activeSection === 'pending' && 'New booking requests will appear here'}
            {activeSection === 'upcoming' && 'Approved lessons will appear here'}
            {activeSection === 'past' && 'Completed lessons will appear here'}
          </p>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Decline Booking</h3>
            <p className="text-gray-600 mb-4">Let the player know why you're declining (optional):</p>
            <textarea
              value={declineReason}
              onChange={e => setDeclineReason(e.target.value)}
              placeholder="I'm not available on that date..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDeclineModal(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecline(showDeclineModal)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggest Change Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Suggest Different Time</h3>
            <p className="text-gray-600 mb-4">Propose an alternative date/time:</p>
            <textarea
              value={suggestedChange}
              onChange={e => setSuggestedChange(e.target.value)}
              placeholder="I'm available on Saturday morning instead..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portal-coach focus:border-transparent resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowSuggestModal(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSuggestChange(showSuggestModal)}
                className="flex-1 py-2 bg-portal-coach text-white rounded-lg font-medium hover:bg-green-600"
              >
                Send Suggestion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
