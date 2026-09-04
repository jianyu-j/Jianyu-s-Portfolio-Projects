import React, { useState } from 'react';
import { BookingRequest, BookingStatus, NtrpLevel } from '../../types';

interface BookingNotificationCardProps {
  booking: BookingRequest;
  onApprove: (id: string) => void;
  onDecline: (id: string, reason?: string) => void;
  onSuggestChange: (id: string, message: string) => void;
  onMessage: (playerId: string, playerName: string) => void;
  compact?: boolean;
}

const BookingNotificationCard: React.FC<BookingNotificationCardProps> = ({
  booking,
  onApprove,
  onDecline,
  onSuggestChange,
  onMessage,
  compact = false,
}) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [suggestMessage, setSuggestMessage] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case '30min': return '30 minutes';
      case '1hour': return '1 hour';
      case '1.5hours': return '1.5 hours';
      case '2hours': return '2 hours';
      default: return duration;
    }
  };

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'Pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending Response</span>;
      case 'Approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Approved</span>;
      case 'Declined':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Declined</span>;
      case 'Completed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Completed</span>;
      case 'Cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  const handleDecline = () => {
    onDecline(booking.id, declineReason);
    setShowDeclineModal(false);
    setDeclineReason('');
  };

  const handleSuggestChange = () => {
    onSuggestChange(booking.id, suggestMessage);
    setShowSuggestModal(false);
    setSuggestMessage('');
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
          {booking.playerName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{booking.playerName}</p>
          <p className="text-xs text-gray-500">{booking.lessonType} • {formatDate(booking.preferredDate)}</p>
        </div>
        {getStatusBadge()}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-portal-coach overflow-hidden">
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                {booking.playerName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{booking.playerName}</h3>
                <p className="text-sm text-gray-500">
                  NTRP {booking.playerNtrp} • {booking.playerLocation || 'Location not specified'}
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Lesson Type</p>
              <p className="text-sm font-medium text-gray-900">{booking.lessonType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Duration</p>
              <p className="text-sm font-medium text-gray-900">{getDurationLabel(booking.duration)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Preferred Date</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(booking.preferredDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Preferred Time</p>
              <p className="text-sm font-medium text-gray-900">{booking.preferredTime}</p>
            </div>
          </div>

          {/* Location Preference */}
          {booking.locationPreference && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Location Preference</p>
              <p className="text-sm text-gray-700">{booking.locationPreference}</p>
            </div>
          )}

          {/* Player Message */}
          {booking.message && (
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <p className="text-xs text-gray-400 mb-1">Message from player</p>
              <p className="text-sm text-gray-700 italic">"{booking.message}"</p>
            </div>
          )}

          {/* Request timestamp */}
          <p className="text-xs text-gray-400">
            Requested {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Actions (only for pending bookings) */}
        {booking.status === 'Pending' && (
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-2">
            <button
              onClick={() => onApprove(booking.id)}
              className="flex-1 sm:flex-none px-4 py-2 bg-portal-coach text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={() => setShowDeclineModal(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => setShowSuggestModal(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Suggest Change
            </button>
            <button
              onClick={() => onMessage(booking.playerId, booking.playerName)}
              className="flex-1 sm:flex-none px-4 py-2 text-portal-coach text-sm font-semibold rounded-lg border border-portal-coach hover:bg-green-50 transition-colors flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </button>
          </div>
        )}

        {/* Response info for non-pending */}
        {booking.status === 'Declined' && booking.declineReason && (
          <div className="px-5 py-4 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-800">
              <span className="font-medium">Decline reason:</span> {booking.declineReason}
            </p>
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Decline Booking</h3>
              <p className="text-sm text-gray-500 mt-1">Let {booking.playerName} know why you can't accept this booking.</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="I'm fully booked that day..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Decline Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggest Change Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Suggest a Change</h3>
              <p className="text-sm text-gray-500 mt-1">Propose an alternative time or arrangement to {booking.playerName}.</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your suggestion</label>
              <textarea
                value={suggestMessage}
                onChange={(e) => setSuggestMessage(e.target.value)}
                placeholder="How about Saturday at 10am instead? I have that slot open..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowSuggestModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSuggestChange}
                disabled={!suggestMessage.trim()}
                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Suggestion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingNotificationCard;
