import React, { useState } from 'react';
import { BookingRequest, BookingStatus } from '../../types';

interface MyBookingsProps {
  playerId: string;
  onMessageCoach: (coachId: string, coachName: string) => void;
  onLeaveReview: (bookingId: string) => void;
}

// Mock data
const MOCK_BOOKINGS: BookingRequest[] = [
  {
    id: 'b1',
    playerId: 'player1',
    playerName: 'You',
    playerNtrp: '3.5',
    coachId: 'coach1',
    coachName: 'Sarah Mitchell',
    lessonType: 'Private',
    preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    preferredTime: 'Morning',
    duration: '1hour',
    message: 'Looking to improve my serve consistency',
    status: 'Approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b2',
    playerId: 'player1',
    playerName: 'You',
    playerNtrp: '3.5',
    coachId: 'coach2',
    coachName: 'Mike Chen',
    lessonType: 'Evaluation',
    preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    preferredTime: 'Afternoon',
    duration: '30min',
    message: 'Would like a skills assessment',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b3',
    playerId: 'player1',
    playerName: 'You',
    playerNtrp: '3.5',
    coachId: 'coach1',
    coachName: 'Sarah Mitchell',
    lessonType: 'Private',
    preferredDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    preferredTime: 'Morning',
    duration: '1hour',
    locationPreference: 'Stanley Park Courts',
    status: 'Completed',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b4',
    playerId: 'player1',
    playerName: 'You',
    playerNtrp: '3.5',
    coachId: 'coach3',
    coachName: 'David Park',
    lessonType: 'Private',
    preferredDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    preferredTime: 'Evening',
    duration: '1.5hours',
    message: 'Interested in footwork drills',
    status: 'Declined',
    declineReason: 'Fully booked that week. Would you be available the following week?',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MyBookings: React.FC<MyBookingsProps> = ({
  playerId,
  onMessageCoach,
  onLeaveReview,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'past'>('upcoming');
  const [bookings] = useState<BookingRequest[]>(MOCK_BOOKINGS);

  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const upcomingBookings = bookings.filter(b => b.status === 'Approved' && new Date(b.preferredDate) >= new Date());
  const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Declined' || b.status === 'Cancelled' || (b.status === 'Approved' && new Date(b.preferredDate) < new Date()));

  const getCurrentBookings = () => {
    switch (activeTab) {
      case 'pending': return pendingBookings;
      case 'upcoming': return upcomingBookings;
      case 'past': return pastBookings;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case '30min': return '30 min';
      case '1hour': return '1 hour';
      case '1.5hours': return '1.5 hours';
      case '2hours': return '2 hours';
      default: return duration;
    }
  };

  const getStatusInfo = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return { label: 'Awaiting Response', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' };
      case 'Approved':
        return { label: 'Confirmed', color: 'bg-green-100 text-green-800', icon: '✓' };
      case 'Declined':
        return { label: 'Declined', color: 'bg-red-100 text-red-800', icon: '✗' };
      case 'Completed':
        return { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: '✓' };
      case 'Cancelled':
        return { label: 'Cancelled', color: 'bg-gray-100 text-gray-600', icon: '—' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-600', icon: '' };
    }
  };

  const currentBookings = getCurrentBookings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
        <p className="text-sm text-gray-500 mt-1">Track your lesson requests and upcoming sessions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
          { id: 'pending', label: 'Pending', count: pendingBookings.length },
          { id: 'past', label: 'Past', count: pastBookings.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-portal-player text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-portal-player" />
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {currentBookings.length > 0 ? (
        <div className="space-y-4">
          {currentBookings.map((booking) => {
            const statusInfo = getStatusInfo(booking.status);
            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-player overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coaches to-green-700 flex items-center justify-center text-lg font-bold text-white">
                        {booking.coachName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.coachName}</h3>
                        <p className="text-sm text-gray-500">{booking.lessonType} Lesson</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(booking.preferredDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="text-sm font-medium text-gray-900">{booking.preferredTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-medium text-gray-900">{getDurationLabel(booking.duration)}</p>
                    </div>
                    {booking.locationPreference && (
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm font-medium text-gray-900">{booking.locationPreference}</p>
                      </div>
                    )}
                  </div>

                  {/* Your Message */}
                  {booking.message && (
                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                      <p className="text-xs text-gray-400 mb-1">Your message</p>
                      <p className="text-sm text-gray-600">"{booking.message}"</p>
                    </div>
                  )}

                  {/* Decline Reason */}
                  {booking.status === 'Declined' && booking.declineReason && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg mb-4">
                      <p className="text-xs text-red-600 mb-1">Coach's response</p>
                      <p className="text-sm text-red-800">{booking.declineReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {booking.status === 'Approved' && (
                      <button
                        onClick={() => onMessageCoach(booking.coachId, booking.coachName)}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message Coach
                      </button>
                    )}
                    
                    {booking.status === 'Completed' && (
                      <button
                        onClick={() => onLeaveReview(booking.id)}
                        className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Leave Review
                      </button>
                    )}

                    {booking.status === 'Declined' && (
                      <button
                        onClick={() => onMessageCoach(booking.coachId, booking.coachName)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message to Reschedule
                      </button>
                    )}

                    {booking.status === 'Pending' && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Waiting for coach to respond
                      </p>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                  Requested on {new Date(booking.createdAt).toLocaleDateString()}
                  {booking.respondedAt && ` • Responded ${new Date(booking.respondedAt).toLocaleDateString()}`}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            No {activeTab} bookings
          </h3>
          <p className="text-sm text-gray-500">
            {activeTab === 'pending' && "You don't have any pending booking requests."}
            {activeTab === 'upcoming' && "You don't have any confirmed lessons coming up."}
            {activeTab === 'past' && "You haven't completed any lessons yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
