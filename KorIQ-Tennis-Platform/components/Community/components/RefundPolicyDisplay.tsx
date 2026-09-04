import React, { useState } from 'react';

interface RefundPolicyDisplayProps {
  eventPrice: number;
  purchaseDate?: string; // ISO string of when user purchased
  eventDate?: string; // ISO string of event date
  compact?: boolean;
}

const RefundPolicyDisplay: React.FC<RefundPolicyDisplayProps> = ({
  eventPrice,
  purchaseDate,
  eventDate,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateRefundStatus = () => {
    if (!purchaseDate) return null;
    
    const now = new Date();
    const purchase = new Date(purchaseDate);
    const event = eventDate ? new Date(eventDate) : null;
    
    const hoursSincePurchase = (now.getTime() - purchase.getTime()) / (1000 * 60 * 60);
    const hoursUntilEvent = event ? (event.getTime() - now.getTime()) / (1000 * 60 * 60) : Infinity;

    if (hoursUntilEvent < 48) {
      return { percentage: 0, reason: 'Less than 48 hours before event', eligible: false };
    }
    if (hoursSincePurchase < 48) {
      return { percentage: 100, reason: 'Within 48 hours of purchase', eligible: true };
    }
    if (hoursSincePurchase < 96) {
      return { percentage: 50, reason: 'Between 48-96 hours after purchase', eligible: true };
    }
    return { percentage: 0, reason: 'More than 96 hours after purchase', eligible: false };
  };

  const refundStatus = calculateRefundStatus();

  if (compact) {
    return (
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Refund Policy
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-medium text-gray-900 text-sm">Refund Policy</h4>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {/* Current Status (if user has purchased) */}
          {refundStatus && (
            <div className={`p-3 rounded-lg ${
              refundStatus.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${refundStatus.eligible ? 'text-green-800' : 'text-red-800'}`}>
                  Your refund status
                </span>
                <span className={`text-sm font-bold ${refundStatus.eligible ? 'text-green-600' : 'text-red-600'}`}>
                  {refundStatus.percentage}% refund
                </span>
              </div>
              <p className={`text-xs mt-1 ${refundStatus.eligible ? 'text-green-600' : 'text-red-600'}`}>
                {refundStatus.reason}
              </p>
              {refundStatus.eligible && (
                <p className="text-xs text-green-700 mt-2">
                  Refund amount: ${(eventPrice * refundStatus.percentage / 100).toFixed(2)}
                </p>
              )}
            </div>
          )}

          {/* Policy Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-gray-600">Within 48 hours of payment</span>
              <span className="font-semibold text-green-600">100% refund</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-gray-600">48-96 hours after payment</span>
              <span className="font-semibold text-yellow-600">50% refund</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-gray-600">After 96 hours</span>
              <span className="font-semibold text-red-600">No refund</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-gray-600">Less than 48h before event</span>
              <span className="font-semibold text-red-600">No refund</span>
            </div>
          </div>

          {/* Auto-cancel note */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-800">
                If the event is cancelled due to not meeting minimum attendees, you'll receive a <strong>full refund</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundPolicyDisplay;
