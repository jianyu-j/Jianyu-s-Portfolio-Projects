import React, { useState } from 'react';
import { Coach, CoachSubscription } from '../../../types';

interface CoachSettingsProps {
  coach: Coach;
  subscription: CoachSubscription;
  onUpdateSubscription: (plan: 'Free' | 'Gold') => void;
}

const CoachSettings: React.FC<CoachSettingsProps> = ({ coach, subscription, onUpdateSubscription }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'subscription' | 'payout' | 'notifications'>('subscription');

  const goldBenefits = [
    { icon: '🎬', title: 'Unlimited Private Tutorials', description: 'Post as many paid tutorials as you want' },
    { icon: '💬', title: 'Unlimited Messages', description: 'No limits on new player conversations' },
    { icon: '📈', title: 'Higher Search Placement', description: 'Appear higher in coach search results' },
    { icon: '⭐', title: 'Featured in Courtside', description: 'Get featured on the landing page' },
    { icon: '🏆', title: 'Gold Badge', description: 'Show your commitment with a Gold badge' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your profile, subscription, and preferences</p>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
        {([
          { id: 'subscription', label: 'Coach Gold' },
          { id: 'profile', label: 'Profile' },
          { id: 'payout', label: 'Payout' },
          { id: 'notifications', label: 'Notifications' },
        ] as const).map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeSection === section.id
                ? 'border-portal-coach text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Coach Gold Section */}
      {activeSection === 'subscription' && (
        <div className="space-y-6">
          {/* Current Plan Card */}
          <div className={`rounded-xl border-2 p-6 ${
            subscription.plan === 'Gold' 
              ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {subscription.plan === 'Gold' ? (
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">
                    {subscription.plan === 'Gold' ? 'Coach Gold' : 'Free Plan'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {subscription.plan === 'Gold' ? '$3/month' : 'Limited features'}
                  </p>
                </div>
              </div>
              {subscription.plan === 'Gold' && (
                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                  ACTIVE
                </span>
              )}
            </div>

            {subscription.plan === 'Free' && (
              <>
                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Private Tutorials</span>
                      <span className="text-sm font-bold text-gray-900">{subscription.privateTutorialsUsed}/3</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${subscription.privateTutorialsUsed >= 3 ? 'bg-red-500' : 'bg-portal-coach'}`}
                        style={{ width: `${(subscription.privateTutorialsUsed / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">New Conversations</span>
                      <span className="text-sm font-bold text-gray-900">{subscription.messagesUsed}/5</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${subscription.messagesUsed >= 5 ? 'bg-red-500' : 'bg-portal-coach'}`}
                        style={{ width: `${(subscription.messagesUsed / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg"
                >
                  Upgrade to Coach Gold - $3/month
                </button>
              </>
            )}

            {subscription.plan === 'Gold' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-portal-coach" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Renews on {subscription.renewsAt ? new Date(subscription.renewsAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Coach Gold Benefits</h3>
            <div className="space-y-4">
              {goldBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-2xl">{benefit.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{benefit.title}</p>
                    <p className="text-sm text-gray-500">{benefit.description}</p>
                  </div>
                  {subscription.plan === 'Gold' && (
                    <svg className="w-5 h-5 text-portal-coach ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Profile Settings</h3>
          <p className="text-gray-500">Profile editing coming soon...</p>
        </div>
      )}

      {/* Payout Section */}
      {activeSection === 'payout' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Earnings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Pending Balance</p>
                <p className="text-2xl font-bold text-gray-900">$12.50</p>
                <p className="text-xs text-gray-400 mt-1">Payouts at $20 minimum</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Earned</p>
                <p className="text-2xl font-bold text-gray-900">$156.00</p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Payout Method</h3>
            <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Connect Bank Account
            </button>
            <p className="text-sm text-gray-500 mt-2">Payouts are processed via Stripe</p>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {[
              { id: 'bookings', label: 'New booking requests', enabled: true },
              { id: 'messages', label: 'New messages', enabled: true },
              { id: 'reviews', label: 'New reviews', enabled: true },
              { id: 'purchases', label: 'Tutorial purchases', enabled: true },
              { id: 'marketing', label: 'Tips & updates from KorIQ', enabled: false },
            ].map(item => (
              <label key={item.id} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{item.label}</span>
                <div className={`w-11 h-6 rounded-full transition-colors ${item.enabled ? 'bg-portal-coach' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Upgrade to Coach Gold</h3>
              <p className="text-white/80 mt-2">$3/month - Cancel anytime</p>
            </div>

            <div className="p-6">
              <ul className="space-y-3 mb-6">
                {goldBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-portal-coach flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{benefit.title}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    onUpdateSubscription('Gold');
                    setShowUpgradeModal(false);
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachSettings;
